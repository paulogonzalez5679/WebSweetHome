const functions = require('firebase-functions');
var mailjet = require('node-mailjet')
.connect('307d6aaf83a24e437da1d1997bbe1bb1', 'a514c03f575fe7077b0d33448d1afcb8')

const admin = require('firebase-admin');
admin.initializeApp();

exports.sendEmailNewOrder = functions.firestore
  .document('emails/new_order/orders/{uid}')
  .onWrite((change, context) => {
    const data = change.after.data();
    const order_transaccion_id = data.order_transaccion_id;
    const order_total = data.order_total;
    const order_user_address = data.order_user_address;
    const order_user_document = data.order_user_document;
    const order_user_email = data.order_user_email;
    const order_user_name = data.order_user_name;
    const order_user_phone = data.order_user_phone;
    const order_time = data.order_time;
    const order_date = data.order_date;
    const order_details =  data.arrayProductCart;


    var list_products = ""
    console.log("se imprime productos");
    order_details.forEach(element => {

      console.log(element.pro_nombre);

      list_products = list_products + '<p>'+'- '+element.pro_nombre+'</p>'
    });
  // //   order_details.map((product, index) => (
  // //     list_products = list_products + '<p>'+product.pro_nombre+'</p>'
  // // ))

  //   console.log("ingresa data",data);
    


    const emailSend = 'info@sweethomeecuador.com'
    const emailReceives = 'sweethomenkec@gmail.com'
    var imgHead = 'https://sweethomeecuador.com/assets/img/logo_inicio.png';
    


    const requestClient = mailjet
      .post("send", {
        'version': 'v3.1'
      })
      .request({
        "Messages": [{
          "From": {
            "Email": emailSend,
            "Name": "Sweet Home Ecuador"
          },
          "To": [{
            "Email": emailReceives,
            "Name": "Sweet Home Ecuador"
          }],
          "Subject": "Notificación de nueva orden de compra: " + order_date + '|' + order_time,
          "TextPart": "Nueva compra",
          "HTMLPart": 
          '<table style="width: 80%; margin: 0 auto;">\
          <tbody>\
          <tr>\
          <td style="width: 448px;">&nbsp;\
          <p style="text-align: center;"><img style="text-align: start;" src="https://firebasestorage.googleapis.com/v0/b/sweethomenkec-2a9bb.appspot.com/o/logo-sweethome%2Flogo_inicio.png?alt=media&token=2d63e396-a34f-4fae-a0d1-f039dc9de55e" alt="" width="167" height="27" /></p>\
          <p style="text-align: center;"><strong>Tienes una nueva orden de compra: #' + order_transaccion_id + '</strong></p>\
          <p>&nbsp;</p>\
          <p><strong>Información general:</strong></p><br/>\
          <p><strong>Nombre del cliente:</strong> ' + order_user_name + '</p>\
          <p><strong>Email:</strong> ' + order_user_email + '</p>\
          <p><strong>Teléfono:</strong> ' + order_user_phone + '</p>\
          <p><strong>Dirección:</strong> ' + order_user_address + '</p>\
          <p><strong>Detalles:</strong> ' + list_products + '</p>\
          <p><strong>Total:</strong> $' + order_total + '</p>\
          <p>&nbsp;</p>\
          </tr>\
          <tr>\
          <td style="width: 448px; text-align: center;"><span style="color: #ffffff;">&nbsp;SweetHome</span></td>\
          </tr>\
          </tbody>\
          </table>',
          "CustomID": "AppGettingStartedTest"
        }]
      })
    requestClient
      .then((result) => {
        console.log("*** Se envio el email correctamente")
      })
      .catch((err) => {
        console.log("entra al error" + err)
      })
    return true;
  });

  exports.sendEmailAceptOrder = functions.firestore
  .document('emails/acept_order/orders/{uid}')
  .onWrite((change, context) => {
    const data = change.after.data();
    const order_transaccion_id = data.order_transaccion_id;
    const order_total = data.order_total;
    const order_user_address = data.order_user_address;
    const order_user_document = data.order_user_document;
    const order_user_email = data.order_user_email;
    const order_user_name = data.order_user_name;
    const order_user_phone = data.order_user_phone;
    const order_time = data.order_time_accepted;
    const order_date = data.order_date;
    const order_details =  data.arrayProductCart;

    var list_products = ""
    console.log("se imprime productos");
    order_details.forEach(element => {

      console.log(element.pro_nombre);

      list_products = list_products + '<p>'+'- '+element.pro_nombre+'</p>'
    });



    const emailSend = 'info@sweethomeecuador.com'
    const emailReceives = order_user_email;

    const requestClient = mailjet
      .post("send", {
        'version': 'v3.1'
      })
      .request({
        "Messages": [{
          "From": {
            "Email": emailSend,
            "Name": "Sweet Home Ecuador"
          },
          "To": [{
            "Email": emailReceives,
            "Name": "Sweet Home Ecuador"
          }],
          "Subject": "Notificación de Sweet Home Ecuador: " + order_date + ' | ' + order_time,
          "TextPart": "Tu orden de compra fue aceptada",
          "HTMLPart": 
          '<table style="width: 80%; margin: 0 auto;">\
          <tbody>\
          <tr>\
          <td style="width: 448px;">&nbsp;\
          <p style="text-align: center;"><img style="text-align: start;" src="https://firebasestorage.googleapis.com/v0/b/sweethomenkec-2a9bb.appspot.com/o/logo-sweethome%2Flogo_inicio.png?alt=media&token=2d63e396-a34f-4fae-a0d1-f039dc9de55e" alt="" width="167" height="27" /></p>\
          <p style="text-align: center;"><strong>Estimad@ ' + order_user_name + ', tu  orden de compra fue aceptada por Sweet Home Ecuador el día: ' + order_date + ' | ' + order_time + '</strong></p>\
          <p><strong>Detalles:</strong> ' + list_products + '</p>\
          <p><strong>Total:</strong> $' + order_total + '</p>\
          <p>&nbsp;</p>\
          <td>\
          </tr>\
          <tr>\
          <td style="width: 448px; text-align: center;"><span style="color: #ffffff;">&nbsp;SweetHome</span></td>\
          </tr>\
          </tbody>\
          </table>',
          "CustomID": "AppGettingStartedTest"
        }]
      })
    requestClient
      .then((result) => {
        console.log("*** Se envio el email correctamente")
      })
      .catch((err) => {
        console.log("entra al error" + err)
      })
    return true;
  });

  exports.sendEmailSendOrder = functions.firestore
  .document('emails/send_order/orders/{uid}')
  .onWrite((change, context) => {
    const data = change.after.data();
    const order_transaccion_id = data.order_transaccion_id;
    const order_total = data.order_total;
    const order_user_address = data.order_user_address;
    const order_user_document = data.order_user_document;
    const order_user_email = data.order_user_email;
    const order_user_name = data.order_user_name;
    const order_user_phone = data.order_user_phone;
    const order_time = data.order_time_accepted;
    const order_date = data.order_date;
    const order_details =  data.arrayProductCart;
    var list_products = ""
    console.log("se imprime productos");
    order_details.forEach(element => {

      console.log(element.pro_nombre);

      list_products = list_products + '<p>'+'- '+element.pro_nombre+'</p>'
    });

    const emailSend = 'info@sweethomeecuador.com'
    const emailReceives = order_user_email;

    const requestClient = mailjet
      .post("send", {
        'version': 'v3.1'
      })
      .request({
        "Messages": [{
          "From": {
            "Email": emailSend,
            "Name": "Sweet Home Ecuador"
          },
          "To": [{
            "Email": emailReceives,
            "Name": "Sweet Home Ecuador"
          }],
          "Subject": "Notificación de Sweet Home Ecuador: " + order_date + ' | ' + order_time,
          "TextPart": "Tu orden de compra fue enviada",
          "HTMLPart": 
          '<table style="width: 80%; margin: 0 auto;">\
          <tbody>\
          <tr>\
          <td style="width: 448px;">&nbsp;\
          <p style="text-align: center;"><img style="text-align: start;" src="https://firebasestorage.googleapis.com/v0/b/sweethomenkec-2a9bb.appspot.com/o/logo-sweethome%2Flogo_inicio.png?alt=media&token=2d63e396-a34f-4fae-a0d1-f039dc9de55e" alt="" width="167" height="27" /></p>\
          <p style="text-align: center;"><strong>Estimad@ ' + order_user_name + ', tus productos ya fueron enviados a ' + order_user_address + ' el día: ' + order_date + ' | ' + order_time + '</strong></p>\
          <p><strong>Detalles:</strong> ' + list_products + '</p>\
          <p>&nbsp;</p>\
          <td>\
          </tr>\
          <tr>\
          <td style="width: 448px; text-align: center;"><span style="color: #ffffff;">&nbsp;SweetHome</span></td>\
          </tr>\
          </tbody>\
          </table>',
          "CustomID": "AppGettingStartedTest"
        }]
      })
    requestClient
      .then((result) => {
        console.log("*** Se envio el email correctamente")
      })
      .catch((err) => {
        console.log("entra al error" + err)
      })
    return true;
  });
