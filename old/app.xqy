(:import module namespace json="http://sendmeafilter.com/common/json" at "/smaf/common/json.xqy";:)
import module namespace david="http://crescendoimprints.com/david" at "david.xqy";

declare namespace app="app";
declare namespace http="http://www.w3.org/1999/xhtml";
declare boundary-space preserve;
declare option xdmp:mapping "false";

declare variable $path := xdmp:get-original-url();
declare variable $ci := 'Crescendo Imprints';
declare variable $title := $ci;
(:    if($g:env or $g:box) then 
    (: <span style="color:cyan;">{{{{g.future}}}}{{{{appendDate()}}}}</span> <span style="color:yellow;">{ fn:string-join(($g:box,$g:env),'-') }</span> :)
        <span> {$ci} </span> 
    else $ci; :)

(:==================================================================================================:)


xdmp:set-response-content-type("text/html"),
'<!DOCTYPE html>
<!--[if IE]><![endif]-->
<!--[if lt IE 7 ]> <html lang="en" class="ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->',
<html data-ng-app="smaf"  id="ng-app" data-ng-controller="SmafController" lang="en" xmlns:ng="http://angularjs.org">
	<head>
    	<title>Crescendo Imprints</title>
    	<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
    	<meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <meta name="title" content="Crescendo Imprints"/>
        <meta name="description" content="Crescendo Imprints: Marklogic Consulting / Software Engineering"/>
        <meta name="keywords" content="marklogic consulting big data content managment engineering music composition choral lds publishing web site creation"/>
        <meta name="generator" content="GetSimple"/>
        <meta name="robots" content="index, follow"/>

        <link rel="stylesheet" href="/resources/css/reset.css"/>
    	<link rel="stylesheet/less" type="text/css" href="/resources/css/style.less"/>
    	<link rel="canonical" href="http://sendmeafilter.com{fn:tokenize(xdmp:get-original-url(),'\?')[1]}"/>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"/>
        <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
        <link rel="apple-touch-icon" href="/favicon.ico"/>
        <!--[if lte IE 8]>
            <script src="/resources/js/json2.js">&nbsp;</script>
        <![endif]-->  	
        <script src="/resources/js/jquery-1.js" type="text/javascript">&nbsp;</script>
    	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min.js"/>
     	<script xsrc="/resources/js/angular.js" type="text/javascript">&nbsp;</script>
        <script src="/resources/js/angular-sanitize.js" type="text/javascript">&nbsp;</script>
    	<script src="/resources/js/underscore.js" type="text/javascript">&nbsp;</script>
        <script src="/resources/js/smafpages/pub.js" type="text/javascript">&nbsp;</script>
        <script src="/resources/js/smafangular.js" type="text/javascript">&nbsp;</script>
    	<script type="text/javascript" src="resources/ckeditor/ckeditor.js">&nbsp;</script>
    	<script src="/resources/js/less.js" type="text/javascript">&nbsp;</script>

    	<!--[if lt IE 9]>
    		<script src="//html5shiv.googlecode.com/svn/trunk/html5.js">&nbsp;</script>
    	<![endif]-->

        <script>(function(d, s, id) {{
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
              fjs.parentNode.insertBefore(js, fjs);
            }}(document, 'script', 'facebook-jssdk'));
        </script>
	</head>

	<body>
        <!-- HEADER -->
    	<div class="header">
    		<div class="wrapper">
    			<div class="logo">
    				<a href="/">{$ci}</a>
    			</div>
    			<div class="site-nav">
             			<ul>
             				<li><a href="mailto:crescendoimprints@gmail.com" title="Contact">Contact</a></li>
             			</ul>
             	</div>
                <div class="banner">
                   <img class="banner-img" src="/resources/image/IMGP9049-banner_mini2.JPG" width="100%"/>
                </div>
             </div>
    	</div>

    	<!-- CONTENT -->
      	<div class="wrapper">
      	    { 
      	        if($path = '/david') then david:content()
      	        else <center><h2>We are currently under construction!</h2><br/><img src="/resources/image/under_construction.jpg"/></center>
      	    }
    	</div>

    	<!-- FOOTER -->
    	<div class="footer">
    		<div class="wrapper">
        		<div class="copyright clearFix">
        			<a href="mailto:crescendoimprints@gmail.com" title="Contact Us">© 2014 CrescendoImprints.com</a>
        		</div>
        	</div>
    	</div>

        <!-- Modal Gray Box Area -->
        <div id="gray-box"></div>
	</body>
</html>

(:

      	        <hr/>
      	        <div style="margin-left:10;margin-top:30;">
                    <img class="person-img" src="/resources/image/DavidSteinerProfile_mini.JPG"/>
              	    <h1>
                        <div>
                            <div style="margin-bottom:10px;">David Steiner</div>
                  	        <ul>
                                <li class="jobtitle">Principal Engineer / Architect <span class="company">at The Church of Jesus Christ of Latter-day Saints</span></li>
                                <li class="jobtitle">Founder / Consultant / Engineer <span class="company">at Crescendo Imprints</span></li>
                  	        </ul>
              	        </div>
                    </h1>
                    <p>
                        <ul>
                             <li class="italic">Previous: <span class="company">GE Healthcare, Intermountain Health Care, Excite@Home, Novell, ProModel</span></li>
                             <li class="italic">Education: <span class="company">Brigham Young University</span></li>
                             <li class="italic">Email: <span class="company"><a href="mailto:imdavidsteiner@gmail.com">imdavidsteiner@gmail.com</a></span></li>
                             <li class="italic">Phone: <span class="company"><a href="#">801-698-9137</a></span></li>
                             <li class="italic">LinkedIn: <span class="company"><a href="http://www.linkedin.com/pub/david-steiner/20/632/340/">david-steiner/20/632/340/</a></span></li>
                         </ul>
                    </p>
                </div>
                <p class="clearLeft"/>
                <hr/>
      	        <h2>Summary</h2>
 :)

