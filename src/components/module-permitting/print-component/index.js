export const handlePrint = (
  title,
  company,
  name,
  date,
  id = 'details-permit',
) => {
  var content = document.getElementById(id).innerHTML
  /* var pri = document.getElementById(frameId).contentWindow
  // var innerDoc = pri?.document.getElementsByClassName('field')

  pri.document.open()
  pri.document.write(content.innerHTML)
  pri.document.close()
  pri.focus()
  pri.print() */
  var a = window.open()
  // a.document.write('<html>')
  const style = `
  body {
    font-family: 'Proxima Nova', sans-serif;
  }
  .field {
    display: flex; 
    flex-direction: column; 
    padding: 10px 0;
    width: 50%
  } 
  .field span {
     color: #878d92;
  } 
  h4{
    margin: 0 10px
  }
  .details-permit {
    margin: 20px 0 0 0; 
    padding: 20px 20px 0 20px; 
    display: flex;
    flex-wrap: wrap;
  } 
  h1 {
    color: #6d7895;
  }
  `
  const header = company
    ? `<span>Company: ${company}</span> | <span>Submitted by: ${name}</span> | <span>Submitted Date: ${date}</span><span>Company: ${company}</span> | <span>Submitted by: ${name}</span> | <span>Submitted Date: ${date}</span>`
    : ''
  a.document.write(
    `<style>${style}</style><body> <h1>${title}</h1><br> ${header} <br>
    <div class='details-permit'>  ${content}  </div>
    </body></html>`,
  )

  a.document.close()
  a.print()
  setTimeout(() => a.close())
}
