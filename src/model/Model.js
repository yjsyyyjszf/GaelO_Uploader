/**
 Copyright (C) 2018-2020 KANOUN Salim
 This program is free software; you can redistribute it and/or modify
 it under the terms of the Affero GNU General Public v.3 License as published by
 the Free Software Foundation;
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 Affero GNU General Public Public for more details.
 You should have received a copy of the Affero GNU General Public Public along
 with this program; if not, write to the Free Software Foundation, Inc.,
 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

export default class Modele {

    data = {
    }

    addStudy(studyObject, dicomStudyID) {
        if (!this.isExistingStudy(dicomStudyID)) {
            this.data[studyObject.studyUID] = studyObject
            return this.data[studyObject.studyUID]
        } else return this.getStudy(dicomStudyID)
    }

    getStudy(studyUID) {
        return this.data[studyUID]
    }

    isExistingStudy(studyInstanceUID) {
        let existingStudyUID = Object.keys(this.data)
        return existingStudyUID.includes(studyInstanceUID)
    }

    getStudiesArray() {
        let studyArray = []
        for (let studyUID in this.data) {
            studyArray.push(this.data[studyUID])
        }
        return studyArray
    }

}