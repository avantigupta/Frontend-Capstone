import React from 'react'
function TableComponent({columns, data}){
  return (
    <div>
     <table>
      <thead>
        <tr>
          {columns.map((column, index) => (
          <th key={index}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, columnIndex) => (
              <td key={columnIndex}>{row[column.accessor]}</td>
            ))}
          </tr>
        ))}
      </tbody>
     </table>
    </div>
  )
}
export default TableComponent;