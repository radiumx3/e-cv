<?php
    
    $url_fr="http://www.cristian-sanna.fr/index-fr_ok.html";
    $url_en="http://www.cristian-sanna.fr/index-en_ok.html";
   
    
    $nom=$_POST["name"];
    $email=$_POST["email"];
    $subject=$_POST["subject"];
    $msg=$_POST["msg"];
    $loc=$_POST["loc"];
  
    
    if($msg !="" && $email !="" && $subject!="" && $nom!=""){

        $destinataire="cristian.sanna@live.fr";


        $headers = "From: \"$nom\"<$email>\n";
        $headers .= "Reply-To: $email \n";
        $headers .= "Content-Type: text/plain; charset=\"iso-8859-1\"";


        mail($destinataire,$subject,$msg,$headers);
    }
    
    if(strcmp($loc,"fr") == 0){        
        redirige($url_fr);
    }else{        
       //redirige($url_en);
    }
    
    
    function redirige($x)
    {
       die('<meta http-equiv="refresh" content="0;URL='.$x.'">');
    }
    
?>