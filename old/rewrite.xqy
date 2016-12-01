import module namespace security="http://sendmeafilter.com/common/security" at "/smaf/common/security.xqy";
declare namespace local="local";
declare variable $requestMethod := xdmp:get-request-method();
declare variable $originalURL := xdmp:get-request-url();
declare variable $host := xdmp:get-request-header("host");

declare function local:transform($url, $prefix) {
    fn:concat($prefix, 
        if($url= "/" or fn:starts-with($url,'/?')) then
            "/app.xqy"
        else if($url= "/favicon.ico") then
            $url
        else if(fn:contains($url, "/resources/") or fn:starts-with($url, "/xqtest/")) then
            $url
        else
            let $url := fn:tokenize($url,'\?')[1]
            let $url :=
            	if(fn:ends-with($url,'/')) then
            		fn:substring($url,1,fn:string-length($url) - 1)
            	else $url
            let $url := fn:concat($url,'.xqy')
            let $url :=
            	if ($requestMethod eq "GET") then
            			(: Duplicate parameters for the request :)
            			let $names := xdmp:get-request-field-names()
            			let $params :=
            				if(fn:count($names) > 0) then
            					fn:string-join((
            						for $name in $names
            						for $value in xdmp:url-encode(xdmp:get-request-field($name))
            						return fn:concat($name,'=',$value)
            					),'&amp;')
            				else ()
            			return fn:string-join(($url,$params),'?')
            	else
            		(: We already have the request parameters in the POST body; so don't duplicate them. :)
            		$url
            return $url
     )
};

let $finalURL :=  
    if(fn:contains($host,'crescendoimprints.com')) then
        if(fn:starts-with($originalURL,"/david")) then
        	"/ci/app.xqy?path=/david"
        else 
            local:transform($originalURL,'/ci')
    else (: if(fn:contains($host,'sendmeafilter.com')) then :)
        local:transform($originalURL,'/smaf')
(:let $log := xdmp:log(fn:concat($originalURL,' --> ',$finalURL))            :)
return $finalURL