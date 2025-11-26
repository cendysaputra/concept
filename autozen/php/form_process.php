<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  if (isset($_POST['action']) && $_POST['action'] === 'subscribe') {
    $email = $_POST["email"];
    $subject = "Subject Subscribe Email"; // Replace your Subject Here
    $to = "recipient@example.com"; // Replace with your email
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-type: text/html\r\n";
    $message = "Subscribe Email " . $email;

    $messageBody = "Email: $email<br>Message: $message";

    if (mail($to, $subject, $messageBody, $headers)) {
      echo "success";
    } else {
      echo "error";
    }
  } elseif (isset($_POST['action']) && $_POST['action'] === 'contact-full') {
    // New full contact form
    $name = $_POST['fullname'];
    $email = $_POST["emailaddress"];
    $phone = $_POST["phone"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    $to = "recipient@example.com"; // Replace with your email
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-type: text/html\r\n";

    $messageBody = "
      <strong>Name:</strong> $name<br>
      <strong>Email:</strong> $email<br>
      <strong>Phone:</strong> $phone<br>
      <strong>Subject:</strong> $subject<br>
      <strong>Message:</strong><br>$message
    ";

    if (mail($to, $subject, $messageBody, $headers)) {
      echo "success";
    } else {
      echo "error";
    }
  } else {
    // Handle other (maybe legacy) form
    $name = $_POST['name'];
    $email = $_POST["email"];
    $message = $_POST["message"];
    $service = $_POST["service"];
    $subject = "Service Inquiry";

    $to = "recipient@example.com"; // Replace with your email
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-type: text/html\r\n";

    $messageBody = "
      <strong>Name:</strong> $name<br>
      <strong>Email:</strong> $email<br>
      <strong>Service:</strong> $service<br>
      <strong>Message:</strong><br>$message
    ";

    if (mail($to, $subject, $messageBody, $headers)) {
      echo "success";
    } else {
      echo "error";
    }
  }
}
