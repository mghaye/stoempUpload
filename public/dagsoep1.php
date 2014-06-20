<?php
//Als er een submit is gedaan worden de gegevens in variabelen gezet
//die we later aan een div gaan toevoegen, maar tevens worden alle variablen aan de
//variabele $data toegevoegd die we gaan schrijven naar een file

if (isset($_POST['submitDag'])) {
    if (isset($_POST['dag1'])) {
        $dag1 = $_POST['dag1'];
        $data = $dag1;
    }
    if (isset($_POST['dag2'])) {
        $dag2 = $_POST['dag2'];
        $data .= $dag2;
    }
    if (isset($_POST['dag3'])) {
        $dag3 = $_POST['dag3'];
        $data .= $dag3;
    }
    if (isset($_POST['dag4'])) {
        $dag4 = $_POST['dag4'];
        $data .= $dag4;
    }
    if (isset($_POST['dag5'])) {
        $dag5 = $_POST['dag5'];
        $data .= $dag5;
    }
    //Deze file gaat altijd de gegevens van de laatste submit bevatten,
    //zodat er  als er geen  nieuwe submit is gebeurd, de gegevens uit deze
    //file worden gebruikt om aan de div #soepen toe te voegen
    $file = "soepprogramma.txt";
    $handle = fopen($file, "w");
    fwrite($handle, $data);
    fclose($handle);

}
?>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="../../assets/ico/favicon.png">

    <title>Soep van de dag</title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.css" rel="stylesheet">
    <link href="css/bootstrap-theme.css" rel="stylesheet">
</head>

<body>


<div class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="icon-bar">

                </span>
                <span class="icon-bar">

                </span>
                <span class="icon-bar">

                </span>
            </button>

            <a class="navbar-brand" href="index.html">
                <img src="img/knop.jpg" width=23 height=19>Centerfuit
            </a>
        </div>

        <div class="navbar-collapse collapse">

            <ul class="nav navbar-nav">

                <li><a href="index.html">Home</a></li>

                <li class="active"><a href="dagsoep1.php">Soep van de dag</a></li>

                <li><a href="lunchbowls.html">Onze lunchbowls</a></li>

                <li><a href="pompoenen.html">Pompoenen</a></li>

                <li><a href="fruitmanden.html">Fruitmanden</a></li>

                <li><a href="tips.html">Tips en recepten</a></li>

                <li><a href="maaltijden.html">Maaltijden</a></li>

                <li><a href="schotels.html">Groenteschotels</a></li>

            </ul>

        </div>

        <!--/.navbar-collapse -->
    </div>

</div>

<!-- Main jumbotron for a primary marketing message or call to action -->

<div class="jumbotron">

    <div class="container"> Om steeds verse soep te hebben wordt er telkens voorraad voor één dag gemaakt,<br/> zodat

        het soms kan gebeuren dat een bepaalde soort reeds voor sluitingsuur uitverkocht is. <br/> Het onderstaande

        aanbod is dus slechts geldig zolang de voorraad strekt.<br/> Wilt u er zeker van zijn uw voorkeur nog te hebben,<br/>

        kom op tijd of bel 012/23 25 80 (tot één dag op voorhand van 8u30 tot 18u30)<br/> om het gewenste aantal te

        reserveren.<br/>
    </div>

</div>


<div class="container">      <!-- Example row of columns -->

    <div class="row">

        <div class="col-lg-4"><img src="img/soepkom.jpg" width=230 height=190> <img src="img/courgette.jpg" width=230

                                                                                    height=190></div>

        <div class="col-lg-4" id="soepen">


        </div>

        <div class="col-lg-4">
            <img src="img/soepnieuw.jpg" width=230 height=190> <img src="img/trostomaat.jpg" width=230 height=190>

        </div>

    </div>

    <hr>


    <footer><p>&copy; Centerfruit 2013</p></footer>

</div>
<!-- /container -->

<!-- Bootstrap core JavaScript    ================================================== -->
<!-- Placed at the end of the document so the pages load faster -->

<script src="js/jquery.js"></script>

<script src="js/bootstrap.min.js"></script>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>

<script>
    $(document).ready(function () {
        //Controleren of er een submit is gedaan zo ja worden de waarden van de submit
        //toegevoegd aan de div #soepen
        <?php if (isset($_POST['submitDag'])){ ?>

        $('#soepen').append('<?php
        if (isset($dag1)){
        echo $dag1;
        } ?>');
        $('#soepen').append('<?php
        if (isset($dag2)){
        echo $dag2;} ?>');
        $('#soepen').append('<?php
        if (isset($dag3)){
        echo $dag3;} ?>');
        $('#soepen').append('<?php
        if (isset($dag4)){
        echo $dag4;} ?>');
        $('#soepen').append('<?php
        if (isset($dag5)){
        echo $dag5;} ?>');
        //Indien niet worden de gegevens van de laatste submit uit de file
        //'soepprogramma.txt' gehaald en toegevoegd aan de div #soepen
        <?php }else{
        $inhoud=file_get_contents('soepprogramma.txt');?>
        $('#soepen').append('<?php echo $inhoud; ?>');
        <?php } ?>


    });
</script>

</body>

</html>