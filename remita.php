<?php 
$serviceTypeId = "4430731";
$amount = "4500";
$merchantId = "2547916";
$apiKey = "1946";
$orderId = "22348";
$payerName = 'austin A';
$payerEmail = "austyno@gmail.com";
$payerPhone = "08035458075";
$hash = hash('sha512', $merchantId.$serviceTypeId.$orderId.$amount.$apiKey);


$post = [
    "serviceTypeId" => $serviceTypeId,
    "amount"     => $amount,
    "orderId"    => $orderId,
    "payerName"  => $payerName,
    "payerEmail" => $payerEmail,
    "payerPhone" => $payerPhone,
    "description" => "Payment for Septmeber Fees"
];
$ch = curl_init('https://remitademo.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
  'Content-type: application/json',
    "Authorization: remitaConsumerKey=$merchantId,remitaConsumerToken=$hash",
));

$response = curl_exec($ch);

curl_close($ch);

var_dump($response);
 ?>