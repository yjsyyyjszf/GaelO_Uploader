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

import React, { Component } from 'react'
import Badge from 'react-bootstrap/Badge'

export default class ParsingDetails extends Component {
  render () {
    return (
      <>
        <Badge variant='secondary'>{this.props.fileLoaded} File(s) loaded</Badge>
        <Badge variant='success'>{this.props.fileParsed} File(s) parsed</Badge>
        <Badge variant='warning' className='du-ignored-badge' onClick={this.props.onClick}>{this.props.fileIgnored} File(s) ignored (Click to show)</Badge>
      </>
    )
  }
}