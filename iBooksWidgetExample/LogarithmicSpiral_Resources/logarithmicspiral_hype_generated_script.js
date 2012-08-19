//	HYPE.documents["LogarithmicSpiral"]

(function HYPE_DocumentLoader() {
	var resourcesFolderName = "LogarithmicSpiral_Resources";
	var documentName = "LogarithmicSpiral";
	var documentLoaderFilename = "logarithmicspiral_hype_generated_script.js";

	// find the URL for this script's absolute path and set as the resourceFolderName
	try {
		var scripts = document.getElementsByTagName('script');
		for(var i = 0; i < scripts.length; i++) {
			var scriptSrc = scripts[i].src;
			if(scriptSrc != null && scriptSrc.indexOf(documentLoaderFilename) != -1) {
				resourcesFolderName = scriptSrc.substr(0, scriptSrc.lastIndexOf("/"));
				break;
			}
		}
	} catch(err) {	}

	// load HYPE.js if it hasn't been loaded yet
	if(typeof HYPE == "undefined") {
		if(typeof window.HYPE_DocumentsToLoad == "undefined") {
			window.HYPE_DocumentsToLoad = new Array();
			window.HYPE_DocumentsToLoad.push(HYPE_DocumentLoader);

			var headElement = document.getElementsByTagName('head')[0];
			var scriptElement = document.createElement('script');
			scriptElement.type= 'text/javascript';
			scriptElement.src = resourcesFolderName + '/' + 'HYPE.js';
			headElement.appendChild(scriptElement);
		} else {
			window.HYPE_DocumentsToLoad.push(HYPE_DocumentLoader);
		}
		return;
	}
	
	var attributeTransformerMapping = {"BorderColorRight":"ColorValueTransformer","BackgroundColor":"ColorValueTransformer","BorderWidthBottom":"PixelValueTransformer","WordSpacing":"PixelValueTransformer","BoxShadowXOffset":"PixelValueTransformer","Opacity":"FractionalValueTransformer","BorderWidthRight":"PixelValueTransformer","BorderWidthTop":"PixelValueTransformer","BoxShadowColor":"ColorValueTransformer","BorderColorBottom":"ColorValueTransformer","FontSize":"PixelValueTransformer","BorderRadiusTopRight":"PixelValueTransformer","TextColor":"ColorValueTransformer","Rotate":"DegreeValueTransformer","Height":"PixelValueTransformer","PaddingLeft":"PixelValueTransformer","BorderColorTop":"ColorValueTransformer","Top":"PixelValueTransformer","BackgroundGradientStartColor":"ColorValueTransformer","TextShadowXOffset":"PixelValueTransformer","PaddingTop":"PixelValueTransformer","BackgroundGradientAngle":"DegreeValueTransformer","PaddingBottom":"PixelValueTransformer","PaddingRight":"PixelValueTransformer","Width":"PixelValueTransformer","TextShadowColor":"ColorValueTransformer","BorderColorLeft":"ColorValueTransformer","ReflectionOffset":"PixelValueTransformer","Left":"PixelValueTransformer","BorderRadiusBottomRight":"PixelValueTransformer","LineHeight":"PixelValueTransformer","BoxShadowYOffset":"PixelValueTransformer","ReflectionDepth":"FractionalValueTransformer","BorderRadiusTopLeft":"PixelValueTransformer","BorderRadiusBottomLeft":"PixelValueTransformer","TextShadowBlurRadius":"PixelValueTransformer","TextShadowYOffset":"PixelValueTransformer","BorderWidthLeft":"PixelValueTransformer","BackgroundGradientEndColor":"ColorValueTransformer","BoxShadowBlurRadius":"PixelValueTransformer","LetterSpacing":"PixelValueTransformer"};

var scenes = [{"timelines":{"kTimelineDefaultIdentifier":{"framesPerSecond":30,"animations":[{"startValue":"0.000000","isRelative":true,"endValue":"1.000000","identifier":"Opacity","duration":2.5,"timingFunction":"easeinout","type":0,"oid":"616B03FC-D070-47F8-B86C-191827960193-69448-0005442173F9B1C7","startTime":0},{"startValue":"-90deg","isRelative":true,"endValue":"0deg","identifier":"Rotate","duration":2.5,"timingFunction":"easeout","type":0,"oid":"616B03FC-D070-47F8-B86C-191827960193-69448-0005442173F9B1C7","startTime":0},{"startValue":"0.000000","isRelative":true,"endValue":"1.000000","identifier":"Opacity","duration":1,"timingFunction":"easeinout","type":0,"oid":"2E461DCE-4A02-43E7-98FF-635875522FF7-69448-00054432EC5F410D","startTime":3},{"startValue":"0.000000","isRelative":true,"endValue":"1.000000","identifier":"Opacity","duration":0.5,"timingFunction":"easeinout","type":0,"oid":"431FA106-DEE6-4608-B3E0-2CBBFA2C7D07-69448-000544A777551747","startTime":4.5},{"startValue":"0.000000","isRelative":true,"endValue":"1.000000","identifier":"Opacity","duration":0.5,"timingFunction":"easeinout","type":0,"oid":"C6141DC3-E3FB-4D94-98A5-C2B1DACD302C-69448-0005446EFC3AC94B","startTime":4.5}],"identifier":"kTimelineDefaultIdentifier","name":"Main Timeline","duration":5}},"id":"454B5357-8EFA-427D-8CE6-FE100FD0EFAB-69448-000543CE37D6AFEE","sceneIndex":0,"perspective":"600px","oid":"454B5357-8EFA-427D-8CE6-FE100FD0EFAB-69448-000543CE37D6AFEE","initialValues":{"DE03B711-0A52-4B3B-8BEC-BBD784ECEDD0-69448-000544DA43D71B63":{"TagName":"div","PaddingRight":"8px","FontSize":"8px","Opacity":"1.000000","Display":"inline","WordWrap":"break-word","PaddingBottom":"8px","Top":"33px","WhiteSpaceCollapsing":"preserve","Position":"absolute","Height":"8px","Left":"164px","TextAlign":"center","InnerHTML":"Images from Joshua Davis Photography and&nbsp;User:Dicklyon (wikipedia.org)","ZIndex":"6","Width":"255px","PaddingLeft":"8px","PaddingTop":"8px","Overflow":"visible","TextColor":"#8B8B8B"},"C6141DC3-E3FB-4D94-98A5-C2B1DACD302C-69448-0005446EFC3AC94B":{"PaddingTop":"8px","FontFamily":"TrebuchetMS,'Lucida Grande',Tahoma,Arial,Sans-Serif","Position":"absolute","TagName":"div","PaddingRight":"8px","Display":"inline","Left":"101px","Overflow":"visible","Opacity":"0.000000","ZIndex":"4","FontSize":"16px","TextColor":"#FFFFFF","WordWrap":"break-word","WhiteSpaceCollapsing":"preserve","PaddingBottom":"8px","PaddingLeft":"8px","Top":"347px","InnerHTML":"x = <i>r</i> cos <i>\u03b8</i> = <i>a</i> cos <i>\u03b8</i><i>e</i><sup><i>b\u03b8<i></i></i></sup>"},"431FA106-DEE6-4608-B3E0-2CBBFA2C7D07-69448-000544A777551747":{"PaddingTop":"8px","FontFamily":"TrebuchetMS,'Lucida Grande',Tahoma,Arial,Sans-Serif","Position":"absolute","TagName":"div","PaddingRight":"8px","Display":"inline","Left":"323px","Overflow":"visible","Opacity":"0.000000","ZIndex":"5","FontSize":"16px","TextColor":"#FFFFFF","WordWrap":"break-word","WhiteSpaceCollapsing":"preserve","PaddingBottom":"8px","PaddingLeft":"8px","Top":"347px","InnerHTML":"y = <i>r</i> sin <i>\u03b8</i> = <i>a</i> sin <i>\u03b8</i><i>e</i><sup><i>b\u03b8<i></i></i></sup>"},"2E461DCE-4A02-43E7-98FF-635875522FF7-69448-00054432EC5F410D":{"Position":"absolute","BackgroundOrigin":"content-box","Left":"70px","Display":"inline","BackgroundImage":"Fibonacci_spiral_34-2.png","Height":"286px","Overflow":"visible","BackgroundSize":"100% 100%","ZIndex":"2","Top":"61px","Width":"460px","Opacity":"0.000000","TagName":"div"},"ED60BF29-87EF-4828-8F83-96DBB7B2001E-69448-00054452334CD293":{"PaddingTop":"8px","FontFamily":"TrebuchetMS,'Lucida Grande',Tahoma,Arial,Sans-Serif","Position":"absolute","TagName":"div","PaddingRight":"8px","Display":"inline","Left":"135px","Overflow":"visible","ZIndex":"3","FontSize":"24px","TextColor":"#FFFFFF","WordWrap":"break-word","WhiteSpaceCollapsing":"preserve","PaddingBottom":"8px","PaddingLeft":"8px","Top":"1px","InnerHTML":"Logarithmic Spirals in Nature"},"616B03FC-D070-47F8-B86C-191827960193-69448-0005442173F9B1C7":{"Position":"absolute","BackgroundOrigin":"content-box","Left":"254px","Display":"inline","BackgroundImage":"Conch-1.jpg","RotationAxis":"0","Height":"300px","Overflow":"visible","BackgroundSize":"100% 100%","ZIndex":"1","Top":"59px","Width":"300px","Opacity":"0.000000","TagName":"div","Rotate":"-90deg"}},"name":"Untitled Scene","backgroundColor":"#000000"}];

var javascriptMapping = {};


	
	var Custom = (function() {
	return {
	};
}());

	
	var hypeDoc = new HYPE();
	
	hypeDoc.attributeTransformerMapping = attributeTransformerMapping;
	hypeDoc.scenes = scenes;
	hypeDoc.javascriptMapping = javascriptMapping;
	hypeDoc.Custom = Custom;
	hypeDoc.currentSceneIndex = 0;
	hypeDoc.mainContentContainerID = "logarithmicspiral_hype_container";
	hypeDoc.resourcesFolderName = resourcesFolderName;
	hypeDoc.showHypeBuiltWatermark = 0;
	hypeDoc.showLoadingPage = false;
	hypeDoc.drawSceneBackgrounds = true;
	hypeDoc.documentName = documentName;

	HYPE.documents[documentName] = hypeDoc.API;

	hypeDoc.documentLoad(this.body);
}());

