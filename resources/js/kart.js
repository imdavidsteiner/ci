$(document).ready(function($) {
	
	var kart = {}; 

	function getOption(select) { return $(select+' option:selected').val(); };
	function setOption(select,newId) {
		$(select+' option:selected').removeAttr('selected');
		$(select+' option[value='+newId+']').attr('selected', 'selected');
	};
	Handlebars.registerHelper('dollar', function(amt) {
		  if (amt >= 0.0) 
		  	return '$' + amt.toFixed(2);
		  else 
			return '<span class="kart-negative">($' + (-amt).toFixed(2) + ')</span>';
	});
	
	$('.manual-button').click(function(){$('.manual').slideToggle(); $('.termsconditions').slideToggle();});
	$('.sizeChange').change(function(){ sizeChange() });	
	function sizeChange() {
		var height = getOption('.sizeHeight');
		var width = getOption('.sizeWidth');
		var thickness = getOption('.sizeThickness');
		$.ajax({
			url:'/filterSelection?height='+height+'&width='+width+'&thickness='+thickness,
			type:"GET",
			success: function(json) {
				var source   = $("#filterType").html();
				var template = Handlebars.compile(source);
				var select = template(json);
				$('.filterType').replaceWith(select);
			},
			error: function(ex) {
				alert(ex.statusText + " - " + ex.status + ". Please try again later.");
			}
		});
	};
	
	$('.paramChange').change(function() { submitKart({ actionType: 'recalc' }) });		
	$('.offerChange').change(function() {  submitKart({ actionType: "validateOffer", code: $('.offerChange').val() }) });		
	//$('.validateOffer').click(function(){ /*submitKart({ actionType: "validateOffer", code: $('.offerChange').val()*/ }); });
	$('.addItem').click(function() {
		if(getOption('.filterType') == 'NA') 
			alert('This filter size cannot be added to your order.\nEmail us to see pricing and availability for your size.');
		else {
			submitKart({ actionType: "add" });
		};
	});
	
	function submitKart(action) {
		kart.frequency = getOption('.frequencyChange');
		kart.starting = getOption('.startChange');
		kart.state = getOption('.stateChange');
		kart.plan = getOption('.planChange');
		kart.offerCode = $('.offerChange').val();
		kart.name = $('.mName').val();
		kart.email = $('.mEmail').val();
		kart.addr1 = $('.mAddr1').val();
		kart.addr2 = $('.mAddr2').val();
		kart.keywords = $('.mKeywords').val();
		kart.city = $('.mCity').val();
		kart.delivered = $('.mDelivered').attr('checked') == 'checked' ? true : false;
		kart.zip = $('.mZip').val();
		kart.paid = $('.mPaid').val();
		kart.addItemForm = {
			qty: $('.newQuantity').val(),
			height: getOption('.sizeHeight'),
			width: getOption('.sizeWidth'),
			thickness: getOption('.sizeThickness'),
			code: getOption('.filterType')
		};
		var json = {
				action:(action ? action : { actionType: 'get' }),
				kart :kart
		};
		$.ajax({
			url:'/kart',
			data: { json: JSON.stringify(json) },
			type:"POST",
			success: function(json) {
				kart = json.kart;
				setOption('.frequencyChange',kart.frequency);
				setOption('.stateChange',kart.state);
				setOption('.startChange',kart.starting);
				setOption('.planChange',kart.plan);
				$('.offerChange').attr('value',kart.offerCode);
				$('.mName').attr('value',kart.name);
				$('.mEmail').attr('value',kart.email);
				$('.mAddr1').attr('value',kart.addr1);
				$('.mAddr2').attr('value',kart.addr2);
				$('.mKeywords').attr('value',kart.keywords);
				$('.mCity').attr('value',kart.city);
				$('.mZip').attr('value',kart.zip);
				$('.mPaid').attr('value',kart.paid);
				if(kart.delivered) $('.mDelivered').attr('checked','checked');
				var template = Handlebars.compile($("#kart").html());
				$('.kart-inner').replaceWith(template(kart));
				$('.removeItem').click(function() {
					var id = this.name.toString();
					submitKart({ actionType: "remove", 	id: id });
				});	
			},
			error: function(ex) {
				alert(ex.statusText + " - " + ex.status + ". Please try again later.");
			}
		});
		
	};
	
	var thickness = getOption('.sizeThickness');
	if(thickness == null) {}
	else {
		submitKart();
		sizeChange();
	}
	
});

