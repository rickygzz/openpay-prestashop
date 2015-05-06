/*
* 2007-2013 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Open Software License (OSL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/osl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author PrestaShop SA <contact@prestashop.com>
*  @copyright  2007-2013 PrestaShop SA
*  @version  Release: $Revision: 6844 $
*  @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*/

$(document).ready(function() {
	
        OpenPay.setId(openpay_merchant_id);
        OpenPay.setApiKey(openpay_public_key);
        OpenPay.setSandboxMode(mode);
        

	//antifraudes
        OpenPay.deviceData.setup("openpay-payment-form", "device_session_id");
	

	$('#openpay-payment-form').submit(function(event) {
            
            /* Prevent the form from submitting with the default action */
            event.preventDefault();
            //return false; 
            
            $('.openpay-payment-errors').hide();
            $('#openpay-payment-form').hide();
            $('#openpay-ajax-loader').show();
            $('.openpay-submit-button').prop('disabled', true); /* Disable the submit button to prevent repeated clicks */

            OpenPay.token.extractFormAndCreate('openpay-payment-form', success_callbak, error_callbak);

	});

	
	/* Catch callback errors */
	if ($('.openpay-payment-errors').text()){
            $('.openpay-payment-errors').fadeIn(1000);
        }
});


var success_callbak = function(response) {
    $('.openpay-payment-errors').hide();
    var token_id = response.data.id;
    $('#openpay-payment-form').append('<input type="hidden" name="openpayToken" value="' + escape(token_id) + '" />');
    $('#openpay-payment-form').get(0).submit();
};


var error_callbak = function(response) {

    var msg = "";
    switch (response.data.error_code) {
        case 1000:
            msg = "Servicio no disponible.";
            break;

        case 1001:
            msg = "Los campos no tienen el formato correcto, o la petición no tiene campos que son requeridos.";
            break;

        case 1004:
            msg = "Servicio no disponible.";
            break;

        case 1005:
            msg = "Servicio no disponible.";
            break;

        case 2004:
            msg = "El dígito verificador del número de tarjeta es inválido de acuerdo al algoritmo Luhn.";
            break;

        case 2005:
            msg = "La fecha de expiración de la tarjeta es anterior a la fecha actual.";
            break;

        case 2006:
            msg = "El código de seguridad de la tarjeta (CVV2) no fue proporcionado.";
            break;

        case 3001:
            msg = "La tarjeta fue declinada.";
            break;

        case 3002:
            msg = "La tarjeta ha expirado.";
            break;

        case 3003:
            msg = "La tarjeta no tiene fondos suficientes.";
            break;

        case 3004:
            msg = "La tarjeta ha sido identificada como una tarjeta robada.";
            break;

        case 3005:
            msg = "La tarjeta ha sido rechazada por el sistema antifraudes.";
            break;

        case 3006:
            msg = "La operación no esta permitida para este cliente o esta transacción.";
            break;

        case 3007:
            msg = "Deprecado. La tarjeta fue declinada.";
            break;

        case 3008:
            msg = "La tarjeta no es soportada en transacciones en línea.";
            break;

        case 3009:
            msg = "La tarjeta fue reportada como perdida.";
            break;

        case 3010:
            msg = "El banco ha restringido la tarjeta.";
            break;

        case 3011:
            msg = "El banco ha solicitado que la tarjeta sea retenida. Contacte al banco.";
            break;

        case 3012:
            msg = "Se requiere solicitar al banco autorización para realizar este pago.";
            break;

        case 3009:
            msg = "La tarjeta fue reportada como perdida.";
            break;

        default: //Demás errores 400 
            msg = "La petición no pudo ser procesada.";
            break;
    }
    
    $('.openpay-payment-errors').fadeIn(1000);
    $('.openpay-payment-errors').text('ERROR ' + response.data.error_code + '. ' + msg).fadeIn(1000);
    $('.openpay-submit-button').prop('disabled', false);
    $('#openpay-payment-form').show();
    $('#openpay-ajax-loader').hide();
    
};