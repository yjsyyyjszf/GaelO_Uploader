import DicomFile from './DicomFile'
import JSZip from 'jszip'
const EventEmitter = require('events').EventEmitter;

export default class DicomBatchUploader extends EventEmitter {

    progressionZipArray = []
    progressionUploadArray = []
    sucessIDsUploaded= []

    constructor (uppy, idVisit, files) {
        super()
        this.uppy = uppy
        this.files = files
        this.idVisit = idVisit
        this.timeStamp = Date.now()
        this.buildBatches()

        this.uppy.on('upload-progress', (file, progress) => {
            this.progressionUploadArray[file.id] = (progress.bytesUploaded/progress.bytesTotal)
            this.emitUploadProgress()
        })

        this.uppy.on('upload-success', async (file, response) => {
            let fileTusId = response['uploadURL'].split('/').pop()
            console.log(fileTusId)
            this.sucessIDsUploaded.push(fileTusId)
            this.currentBatchUpload = ++this.currentBatchUpload
            this.emitBatchUploadDoneIfTerminated()
            await this.batchesIterator.next()
        })

    }

    emitZipProgress(){
        let zipProgress = 0
        this.progressionZipArray.forEach(percent =>{
            zipProgress += (this.batchValue * percent)/100
        })
        zipProgress = Math.round( Math.min( zipProgress  , 100) )
        this.zipProgress=zipProgress
        this.emit('batch-zip-progress', zipProgress )
        
    }

    emitBatchUploadDoneIfTerminated(){
        if(this.zipProgress>=100 && this.uploadProgress >= 100) {
            this.emit('batch-upload-done', this.timeStamp, this.files.length, this.sucessIDsUploaded)
        }
    }

    /**
     * Calculate upload progression by summing each file progression fration,
     * and emit upload and zip progression,
     * if job ended (zip+upload) emit batch upload done message
     */
    emitUploadProgress(){
        let uploadProgress = 0;
        Object.keys(this.progressionUploadArray).forEach(fileID =>{
            uploadProgress += this.progressionUploadArray[fileID] * this.batchValue
        })

        uploadProgress = Math.round( Math.min(uploadProgress , 100) )
        this.uploadProgress=uploadProgress
        this.emit('batch-upload-progress', uploadProgress )
        
    }

    async startUpload(){
        await this.batchesIterator.next()
        await this.batchesIterator.next()
    }

    buildBatches(){
        this.batches = []
        this.currentBatchZip = 0
        this.currentBatchUpload = 0

        let index = 0
        do{
            index = this.makeBatch(index)
        }while( index < this.files.length )

        this.batchesIterator = this.buildNextZip()
        this.batchValue = 100 / this.batches.length

    }

    makeBatch(index){
        let cummulativeSize = 0
        let batch = []
        while( cummulativeSize < ( 100 * Math.pow(10, 6) ) && index < this.files.length ){
            cummulativeSize = cummulativeSize + this.files[index].size
            batch.push(this.files[index])
            index = ++index
        }
        this.batches.push(batch)
        return index

    }

    /**
     * Generator generating subzips of the bactch
     */
    buildNextZip = async function*(){

        let index = 0
        for (let batch of this.batches){
            index = ++index
            let zipBlob = await this.zipFiles(batch, index)
            this.uppy.addFile(
                {
                    name: this.timeStamp+'_'+this.idVisit+'_'+index+'_'+this.batches.length+'.zip', // file name
                    type: 'application/zip', // file type
                    meta: {
                        //add metadata
                        idVisit : this.idVisit,
                        timeStamp : this.timeStamp,
                        zipNumber : index,
                        numberOfZips : this.batches.length,
                        dicomFiles : batch.length,
                        totalDicomFiles :  this.files.length
                    },
                    data: zipBlob // file blob
                }
            )

            yield true

        }

        return

    }


    async zipFiles(files, index){

        let jszip = new JSZip();
        for (let file of files){
            let dicomFile = new DicomFile(file)
            await dicomFile.readDicomFile()
            dicomFile.anonymise()
            jszip.file(dicomFile.getFilePath(), dicomFile.byteArray);
        }

        let uintarray = await jszip.generateAsync(
            // Zipping options
            {
                type: "uint8array",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 3,
                    streamFiles: true
                }
            }
        , (progress)=>{ 
            this.progressionZipArray[index] = progress.percent
            this.emitZipProgress()
        })
        let zipBlob = new Blob([uintarray], { type: 'application/zip' });
        return zipBlob

    }

}