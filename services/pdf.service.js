import fs from 'fs'
import PDFDocument from 'pdfkit'

export const pdfService = {
    buildBugsPDF

}

function buildBugsPDF(bugs,res) {
  const doc = new PDFDocument()

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=bugs.pdf')

  // Pipe its output somewhere, like to a file or HTTP response
  doc.pipe(res)  // Save the PDF to a file

  // iterate bugs array, and create a pdf with all the bugs
  bugs.forEach((bug, index) => {
    doc.text(`Bug ID: ${bug._id}`) 
    doc.text(`Title: ${bug.title}`) 
    doc.text(`Description: ${bug.description}`)
    doc.text(`Severity: ${bug.severity}`)
    if (index < bugs.length - 1) doc.addPage() 
  })

  // finalize PDF file
  doc.end()
}

