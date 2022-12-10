import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';  
import { Alignment, Margins } from 'pdfmake/interfaces';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs; 

export function DocGenInvoice(formValues: any) {
  let docDefinition =
  {
    header: [
      '\n',
      {
        style: 'titleMain',
        text: 'Distributor Invoice',
      }
    ],
    content: [
      '\n',
      {
        text: `Date: ${new Date().toISOString().split('T')[0]}`,
      },
      {
        text: `Invoice Date: ${new Date(formValues.invoiceDate)?.toISOString().split('T')[0]}`,
      },
      {
        text: `Invoice No: ${formValues.invoiceNumber}`,
      },
      '\n',
      {
        style: 'title',
        text: 'Distributor Details',
      },
      {
        text: `Name: ${formValues.distributor?.name}`,
      },
      {
        text: `Phone No.: ${formValues.distributor?.phoneNumber}`,
      },
      '\n',
      {
        style: 'tableTitle',
        text: 'List of Products',
      },
      {
        style: 'table',
        table: {
          headerRows: 1,
          widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
          body: [
            ['Product Name','Pack','Batch No.','Mfg. Date','Exp. Date','Qty','Free Items','MRP','Rate','Discount','GST %','HSN Code'],
            ...formValues.invoiceItems.map((x: { item: { name: any; hsn: { gstRate: any; hsnCode: any; }; }; pack: any; batchNo: any; mfgDate: any; expDate: any; qty: any; freeItems: any; mrp: any; rate: any; discount: any; })=>(
              [`${x.item.name}`,`${x.pack}`,`${x.batchNo}`,`${new Date(x.mfgDate).toISOString().split('T')[0]}`,`${new Date(x.expDate).toISOString().split('T')[0]}`,`${x.qty}`,`${x.freeItems}`,`${x.mrp}`,`${x.rate}`,`${x.discount}`,`${x.item.hsn.gstRate}`,`${x.item.hsn.hsnCode}`]
            )),
            ['Amount',`${formValues.amount}`,'','','Total Discount',`${formValues.totalDiscount}`,'','','Total Amount',`${formValues.actualAmount}`,'','']
          ],
        },
      },
      '\n',
      {
        qr: `string`,
        // fit: '50' 
      },
      { 
        text: 'Signature', 
        alignment: 'right' as Alignment, 
        italics: true 
      },
    ],
    styles: {
      titleMain: {
        bold: true,
        italics: true,
        alignment: 'center' as Alignment,
        fontSize: 15,
      },
      title: {
        bold: true,
        italics: true,
      },
      tableTitle: {
        bold: true,
        italics: true,
      },
      table: {
        margin: [-25,0,0,0] as Margins,
      }
    },
    defaultStyle: {
      // alignment: 'justify'
    }
  };

  return pdfMake.createPdf(docDefinition).open();
}