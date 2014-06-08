<?php

    $nom=$_POST["name"];
    $email=$_POST["email"];
    $subject=$_POST["subject"];
    $msg=$_POST["msg"];
  
    
    if($msg !="" && $email !="" && $subject!="" && $nom!=""){

        $destinataire="cristian.sanna@live.fr";


        $headers = "From: \"$nom\"<$email>\n";
        $headers .= "Reply-To: $email \n";
        $headers .= "Content-Type: text/plain; charset=\"iso-8859-1\"";


        mail($destinataire,$subject,$msg,$headers);
    }
    
    header('Location: http://www.cristian-sanna.fr/index.html');
?>