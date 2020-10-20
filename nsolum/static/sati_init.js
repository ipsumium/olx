({
	name:"adtlgcen_Cookie",
	set:function(n,v,c){this.setSecure(n,v,c);if(!this.get(n)){this.setNonSecure(n,v,c);}},
    setNonSecure:function(n,v,c){var d,e="";d=new Date();if(c){d.setTime(d.getTime()+c*60*60*1000);};e="; expires="+d.toGMTString();document.cookie=escape(n)+"="+v+e+"; path=/";},
    setSecure:function(n,v,c){var d,e="";d=new Date();if(c){d.setTime(d.getTime()+c*60*60*1000);};e="; expires="+d.toGMTString();document.cookie=escape(n)+"="+v+e+"; path=/; SameSite=None; Secure";},
	get:function(n){var e,b,p,c=document.cookie;p=n+"=";b=c.indexOf(";"+" "+p);if(b==-1){b=c.indexOf(p);if(b!==0){return "";}}else{b+=2;}e=c.indexOf(";",b);if(e==-1){e=c.length;}return unescape(c.substring(b+p.length,e));},
	unset:function(n){return this.set(n,"");},
	init:function(){window[this.name]=this;},
	shouldSendSameSiteNone:function(){
        return !this.isSameSiteNoneIncompatible(navigator.userAgent);
    },
    isSameSiteNoneIncompatible:function(useragent){
        return this.hasWebKitSameSiteBug(useragent) || this.dropsUnrecognizedSameSiteCookies(useragent);
    },
    hasWebKitSameSiteBug:function(useragent){
        return this.isIosVersion(12, useragent) ||
               (this.isMacosxVersion(10, 14, useragent) && (this.isSafari(useragent) || this.isMacEmbeddedBrowser(useragent)));
    },
    dropsUnrecognizedSameSiteCookies:function(useragent){
        if(this.isUcBrowser(useragent)){
            return !this.isUcBrowserVersionAtLeast(12, 13, 2, useragent);
        }
        return this.isChromiumBased(useragent) &&
               this.isChromiumVersionAtLeast(51, useragent) &&
               !this.isChromiumVersionAtLeast(67, useragent);
    },
    isIosVersion:function(major, useragent){
        var match = useragent.match(/iP.+;\sCPU\s.*OS\s(\d+)[_\d]*.*AppleWebKit/i);
        return match && match[1] == major;
    },
    isMacosxVersion:function(major, minor, useragent){
        var match = useragent.match(/Macintosh;\s.*Mac\sOS\sX\s(\d+)_(\d+)[_\d+]*.*AppleWebKit/i);
        return match && match.length>2 && match[1] == major && match[2] == minor;
    },
    isSafari:function(useragent){
        var match = useragent.match(/Version.*Safari/i);
        return match && !isChromiumBased(useragent)
    },
    isMacEmbeddedBrowser:function(useragent){
        var match = useragent.match(/^Mozilla\/[\.\d]+.*\(Macintosh;.*Mac OS X\s*[_\d]?.*\) AppleWebKit\/[\.\d]+.*\(KHTML, like Gecko.*\)/i);
        return match && match.length > 0;
    },
    isChromiumBased:function(useragent){
        var match = useragent.match(/Chrom[[e|ium]+/i);
        return match && match.length > 0;
    },
    isChromiumVersionAtLeast:function(major, useragent){
        var match = useragent.match(/Chrom[^ \/]+\/(\d+)[\.\d]*/i);
        return match && match.length>0 && match[0] >= major;
    },
    isUcBrowser:function(useragent){
        var match = useragent.match(/UCBrowser/i);
        return match && match.length > 0;
    },
    isUcBrowserVersionAtLeast:function(major, minor, build, useragent){
        var match = useragent.match(/UCBrowser\/(\d+)\.(\d+)\.(\d+)[\.\d]*/i);
        if(match && match.length>=4){
            var major_version = parseInt(match[1]);
            var minor_version = parseInt(match[2]);
            var build_version = parseInt(match[3]);
            if(major_version != major){
                return major_version > major;
            }
            if(minor_version != minor){
                return minor_version > minor;
            }
            return build_version >= build;
        }
    }
}).init();

var cX = cX || {};
cX.callQueue = cX.callQueue || [];

if (!window.admp_) {
	//Seems to be a Safari bug. All properties of location are undefined
	try { window.loc_ = (window.location.href == 'undefined' && JSON && JSON.parse && JSON.stringify) ? JSON.parse(JSON.stringify(window.location)) : window.location; }catch(err){window.loc_ = window.location;}
	if (!window.loc_.origin) {
		window.loc_.origin = window.loc_.protocol + "//" + window.loc_.hostname + (window.loc_.port ? ':' + window.loc_.port: '');
	}
	window.adtlgcen = window.adtlgcen || {};
	adtlgcen.config = adtlgcen.config || {};
	adtlgcen.taskQueue = adtlgcen.taskQueue || [];
	adtlgcen.util = adtlgcen.util || {};
	adtlgcen.util.survey = adtlgcen.util.survey || {};

    var adtlgcen_SETTINGS = {
		TC_URL: window.loc_.protocol + "//admp-tc-sati.adtlgc.com",
		SCRIPT_VERSION_PARAMETER: "&v=2.39",
		SURVEY_URL: "https://surveys.synoint.com/view/index.php?sid=69935&lang=ro",
		SURVEY_URL_EN: "https://surveys.synoint.com/view/index.php?sid=69935&lang=en",
		SURVEY_VISITOR_SEGMENT: "kv1099#1",
		MAX_SURVEY_CYCLES: 7,
		MIN_HOURS_BETWEEN_CYCLES: 9
	};

	var enr_vars = {
		evid: "evid_0046",
		cxid: "cxid_0046",
		evid_v: "evid_v_0046",
		evid_set: "evid_set_0046",
		adptseg: "adptseg_0046",
		adptset: "adptset_0046",
		survey_set: "en_survey_set_0046",
		survey_cycle: "en_survey_cycle_0046",
		survey_start_date: "en_survey_start_date_0046",
		last_survey_cycle_date: "en_last_survey_cycle_date_0046",
		last_survey_cycle_domain: "en_last_survey_cycle_domain_0046",
		dataRequest: "adapt_dataRequest_sati_admp",
		persistedUpdateQueryId: "096c137d85bdfbc7fb621f47eeddbeb176fb55a2",
		persistedLinkQueryId: "d3e8df9997aeee5ba2f95355e3a5f41e26827275",
		cxPrefixes: ["bre"]
	};

	var segmentGroups = {
		"kv1001": "-SATI-Gender",
		"kv1002": "-SATI-Age",
		"kv1003": "-SATI-education-level",
		"kv1004": "-SATI-personal-income",
		"kv1005": "-SATI-occupation",
		"kv1006": "-SATI-children",
		"kv1008": "-SATI-Household-children",
		"kv1009": "-SATI-Visitor-interests",
		"kv1010": "-SATI-employment-status",
		"kv1011": "-SATI-marital-status",
		"kv1012": "-SATI-household-MainShopper",
		"kv1013": "-SATI-household-income",
		"kv1014": "-SATI-studying-status",
		"kv1015": "-SATI-ESOMAR",
		"kv1017": "-SATI-Urban-Rural",
		"kv1019": "-SATI-buying-intent-goods",
		"kv1020": "-SATI-buying-intent-service"
	};

	var segmentValues = {
		"kv1001=a": "Male",
		"kv1001=b": "Female",
		"kv1002=b": "16-18",
		"kv1002=c": "19-24",
		"kv1002=d": "25-34",
		"kv1002=e": "35-44",
		"kv1002=f": "45-54",
		"kv1002=g": "55-64",
		"kv1002=h": "65-74",
		"kv1002=i": "Over 75",
		"kv1003=a": "Less than 7 Grades",
		"kv1003=b": "7-8 Grades (Secondary School)",
		"kv1003=c": "10 Grades",
		"kv1003=d": "Vocational School",
		"kv1003=e": "High School",
		"kv1003=f": "Post High School",
		"kv1003=g": "University degree",
		"kv1004=a": "No income",
		"kv1004=b": "under 1.500 RON",
		"kv1004=c": "1.501-3.500 RON",
		"kv1004=d": "3.501-5.000 RON",
		"kv1004=e": "Over 5.001 RON",
		"kv1005=a": "Employer",
		"kv1005=b": "High level employee",
		"kv1005=c": "Low level employee",
		"kv1005=d": "Not working",
		"kv1006=a": "Has children under 14",
		"kv1006=b": "Has no children under 14",
		"kv1008=a": "At least one child 0-3 y.o.",
		"kv1008=b": "At least one child 4-6 y.o.",
		"kv1008=c": "At least one child 7-10 y.o.",
		"kv1008=d": "At least one child 11-13 y.o.",
		"kv1010=a": "Full time",
		"kv1010=b": "Part time",
		"kv1010=c": "Seasonal",
		"kv1010=d": "Unemployed",
		"kv1011=a": "Married",
		"kv1011=b": "Not married, living with a partner",
		"kv1011=c": "Not married",
		"kv1011=d": "Divorced",
		"kv1011=e": "Widow",
		"kv1012=a": "Yes",
		"kv1012=b": "No",
		"kv1009=1": "Pets",
		"kv1009=10": "Style and Fashion",
		"kv1009=11": "Food and Drink",
		"kv1009=12": "Technology and Computing",
		"kv1009=13": "Video Gaming",
		"kv1009=14": "Plants & Gardening",
		"kv1009=15": "Healthy Living",
		"kv1009=16": "Music and Audio",
		"kv1009=17": "Events and Attractions",
		"kv1009=18": "Family and Relationships",
		"kv1009=19": "Video Imaging & Photos",
		"kv1009=2": "Interior Design & Furnishing",
		"kv1009=20": "Science",
		"kv1009=21": "Medical Health",
		"kv1009=22": "Sports",
		"kv1009=23": "Pop Culture",
		"kv1009=24": "Travel",
		"kv1009=25": "Home Improvement & DIY",
		"kv1009=27": "Books and Literature",
		"kv1009=28": "Education",
		"kv1009=29": "Fine Art",
		"kv1009=30": "Hobbies and Interests",
		"kv1009=31": "Movies",
		"kv1009=32": "News and Politics",
		"kv1009=33": "Shopping",
		"kv1009=34": "Television",
		"kv1009=35": "Real Estate",
		"kv1009=36": "Religion and Spirituality",
		"kv1009=3": "Automotive",
		"kv1009=4": "Active Outdoors & Nature",
		"kv1009=5": "Personal Finance",
		"kv1009=6": "Business and Finance",
		"kv1009=7": "Theater, Arts & Culture",
		"kv1009=8": "Organic & Sustainable Development",
		"kv1009=9": "Celebrities & Entertainment",
		"kv1013=a": "No income",
		"kv1013=b": "under 1.500 RON",
		"kv1013=c": "1.501-3.500 RON",
		"kv1013=d": "3.501-5.000 RON",
		"kv1013=e": "5.001-10.000 RON",
		"kv1013=f": "Over 10.001 RON",
		"kv1014=a": "School child",
		"kv1014=b": "Student (University)",
		"kv1014=c": "Student on a vacation school",
		"kv1014=d": "Following postgraduate studies",
		"kv1014=e": "No",
		"kv1015=a": "AB",
		"kv1015=b": "C",
		"kv1015=c": "DE",
		"kv1017=a": "Urban",
		"kv1017=b": "Rural",
		"kv1019=1": "TV Set",
		"kv1019=2": "Audio/video equipament",
		"kv1019=3": "Digital photo/video devices",
		"kv1019=4": "New car",
		"kv1019=5": "Second-hand car",
		"kv1019=6": "Land (real estate)",
		"kv1019=7": "House/flat for current home",
		"kv1019=8": "Holiday house",
		"kv1019=9": "Mobile phone/smartphone",
		"kv1019=10": "Furniture",
		"kv1019=11": "Kitchen furniture/appliances",
		"kv1019=12": "Big household appliances",
		"kv1019=13": "Redecorating the house/flat",
		"kv1019=14": "Desktop PC/Laptop",
		"kv1019=15": "Computer accesories (printer etc.)",
		"kv1019=16": "Sport equipement",
		"kv1019=17": "None of the above",
		"kv1020=1": "TV subscription",
		"kv1020=2": "Internet access",
		"kv1020=3": "CASCO insurance",
		"kv1020=4": "House insurance",
		"kv1020=5": "Personal insurance",
		"kv1020=6": "Retirement insurance",
		"kv1020=7": "Medical services",
		"kv1020=8": "Mobile phone services",
		"kv1020=9": "Loan to buy/build a house or land",
		"kv1020=10": "Loan to buy a car",
		"kv1020=11": "Loan for personal needs",
		"kv1020=12": "Plane tickets",
		"kv1020=13": "Travel services",
		"kv1020=14": "Credit card",
		"kv1020=15": "Debit card",
		"kv1020=16": "Electricity supply services"
	};

	var survey_logos = {
		'4tuning.ro': '4tuning.ro.jpg',
		'9am.ro': '9am.ro.png',
		'a1.ro': 'a1.ro.png',
		'academiacatavencu.info': 'academiacatavencu.info.jpg',
		'acasatv.ro': 'acasatv.ro.png',
		'adevarul.ro': 'adevarul.ro.jpg',
		'adevarulfinanciar.ro': 'adevarulfinanciar.ro.png',
		'agerpres.ro': 'agerpres.ro.jpg',
		'agrointel.ro': 'agrointel.ro.png',
		'andreeabanica.com': 'andreeabanica.com.png',
		'andreearaicu.ro': 'andreearaicu.ro.png',
		'antena3.ro': 'antena3.ro.png',
		'antenastars.ro': 'antenastars.ro.png',
		'apropotv.ro': 'apropotv.ro.png',
		'auto-bild.ro': 'auto-bild.ro.jpg',
		'automarket.ro': 'automarket.ro.jpg',
		'autovit.ro': 'autovit.ro.jpg',
		'avantaje.ro': 'avantaje.ro.jpg',
		'avocatnet.ro': 'avocatnet.ro.png',
		'b1.ro': 'b1.ro.jpg',
		'b365.ro': 'b365.ro.png',
		'bebelu.ro': 'bebelu.ro.png',
		'bravonet.ro-_noizz.no': 'bravonet.ro-_noizz.no.png',
		'breslo.ro': 'breslo.ro.jpg',
		'bucataras.ro': 'bucataras.ro.png',
		'business24.ro': 'business24.ro.png',
		'businessmagazin.ro': 'businessmagazin.ro.jpg',
		'calificativ.ro': 'calificativ.ro.png',
		'calificative.ro': 'calificative.ro.png',
		'cancan.ro': 'cancan.ro.png',
		'capital.ro': 'capital.ro.png',
		'cariereonline.ro': 'cariereonline.ro.png',
		'cars.ro': 'cars.ro.png',
		'cartederetete.ro': 'cartederetete.ro.jpg',
		'casa-gradina.ro': 'casa-gradina.ro.png',
		'casadex.ro': 'casadex.ro.png',
		'casamea.ro': 'casamea.ro.png',
		'catavencii.ro': 'catavencii.ro.png',
		'catchy.ro': 'catchy.ro.png',
		'ciao.ro': 'ciao.ro.png',
		'cinemagia.ro': 'cinemagia.ro.gif',
		'cinemarx.ro': 'cinemarx.ro.jpg',
		'click.ro': 'click.ro.png',
		'clickpentrufemei.ro': 'clickpentrufemei.ro.png',
		'clickpoftabuna.ro': 'clickpoftabuna.ro.png',
		'clopotel.ro': 'clopotel.ro.jpg',
		'conso.ro': 'conso.ro.png',
		'conta.ro': 'conta.ro.jpg',
		'cookandplay.ro': 'cookandplay.ro.jpg',
		'copilul.ro': 'copilul.ro.png',
		'cosmopolitan.ro': 'cosmopolitan.ro.jpg',
		'cotidianul.ro': 'cotidianul.ro.jpg',
		'crestinortodox.ro': 'crestinortodox.ro.png',
		'csid.ro': 'csid.ro.png',
		'culinar.ro': 'culinar.ro.png',
		'cursbnr.ro': 'cursbnr.ro.png',
		'cursvalutar.ro': 'cursvalutar.ro.png',
		'dailybusiness.ro': 'dailybusiness.ro.jpg',
		'debarbati.ro': 'debarbati.ro.gif',
		'descopera.ro': 'descopera.ro.png',
		'desprecopii.com': 'desprecopii.com.png',
		'dietetik.ro': 'dietetik.ro.jpg',
		'digi24.ro': 'digi24.ro.svg',
		'digisport.ro': 'digisport.ro.jpg',
		'dilemaveche.ro': 'dilemaveche.ro.png',
		'disney.ro': 'disney.ro.jpg',
		'divahair.ro': 'divahair.ro.svg',
		'doctorulzilei.ro': 'doctorulzilei.ro.jpg',
		'doingbusiness.ro': 'doingbusiness.ro.png',
		'dolce-sport.ro': 'dolce-sport.ro.jpg',
		'ebihoreanul.ro': 'ebihoreanul.ro.png',
		'economica.net': 'economica.net.png',
		'ecuisine.ro': 'ecuisine.ro.png',
		'edamagazine.ro': 'edamagazine.ro.png',
		'ejobs.ro': 'ejobs.ro.png',
		'elacraciun.ro': 'elacraciun.ro.gif',
		'ele.ro': 'ele.ro.jpg',
		'elle.ro': 'elle.ro.jpg',
		'euractiv.ro': 'euractiv.ro.png',
		'europafm.ro': 'europafm.ro.jpg',
		'eva.ro': 'eva.ro.jpg',
		'evz.ro': 'evz.ro.png',
		'fanatik.ro': 'fanatik.ro.png',
		'femeia.ro': 'femeia.ro.jpg',
		'feminis.ro': 'feminis.ro.png',
		'finzoom.ro': 'finzoom.ro.gif',
		'forum.softpedia.com': 'forum.softpedia.com.png',
		'gandul.info': 'gandul.info.png',
		'garbo.ro': 'garbo.ro.jpg',
		'glamour.ro': 'glamour.ro.png',
		'go4it.ro': 'go4it.ro.jpg',
		'gradinamea.ro': 'gradinamea.ro.png',
		'gsp.ro': 'gsp.ro.png',
		'gustarte.ro': 'gustarte.ro.png',
		'gustos.ro': 'gustos.ro.png',
		'historia.ro': 'historia.ro.jpg',
		'hotnews.ro': 'hotnews.ro.jpg',
		'huff.ro': 'huff.ro.jpg',
		'imobiliare.ro': 'imobiliare.ro.jpg',
		'incasa.ro': 'incasa.ro.png',
		'incomemagazine.ro': 'incomemagazine.ro.png',
		'jurnalul.ro': 'jurnalul.ro.jpg',
		'kanald.ro': 'kanald.ro.png',
		'kfetele.ro': 'kfetele.ro.png',
		'kissfm.ro': 'kissfm.ro.jpg',
		'kudika.ro': 'kudika.ro.jpg',
		'laurasweets.ro': 'laurasweets.ro.jpg',
		'libertatea.ro': 'libertatea.ro.jpg',
		'libertateapentrufemei.ro': 'libertateapentrufemei.ro.jpg',
		'magicfm.ro': 'magicfm.ro.jpg',
		'main-brat': 'main-brat.jpg',
		'mami.ro': 'mami.ro.gif',
		'manager.ro': 'manager.ro.png',
		'marieclaire.ro': 'marieclaire.ro.png',
		'mediafax.ro': 'mediafax.ro.jpg',
		'menshealth.ro': 'menshealth.ro.png',
		'metropotam.ro': 'metropotam.ro.jpg',
		'miresici.ro': 'miresici.ro.png',
		'miscareaderezistenta.ro': 'miscareaderezistenta.ro.png',
		'misiuneacasa.ro': 'misiuneacasa.ro.jpg',
		'mixtopia.ro': 'mixtopia.ro.jpg',
		'money.ro': 'money.ro.png',
		'monitorulbt.ro': 'monitorulbt.ro.png',
		'monitorulexpres.ro': 'monitorulexpres.ro.jpg',
		'monitorulsv.ro': 'monitorulsv.ro.jpg',
		'mtv.ro': 'mtv.ro.jpg',
		'mytex.ro': 'mytex.ro.png',
		'nicolaitand.ro': 'nicolaitand.ro.png',
		'obiectiv.info': 'obiectiv.info.png',
		'obiectivbr.ro': 'obiectivbr.ro.jpg',
		'observator.tv': 'observator.tv.svg',
		'okmagazine.ro': 'okmagazine.ro.png',
		'olx.ro': 'olx.ro.png',
		'one.ro': 'one.ro.jpg',
		'onefm.ro': 'onefm.ro.png',
		'onlinesport.ro': 'onlinesport.ro.png',
		'paginiaurii.ro': 'paginiaurii.ro.jpg',
		'parinti.com': 'parinti.com.gif',
		'perfecte.ro': 'perfecte.ro.gif',
		'petocuri.ro': 'petocuri.ro.png',
		'pieseauto.ro': 'pieseauto.ro.png',
		'playtech.ro': 'playtech.ro.jpg',
		'povesteacasei.ro': 'povesteacasei.ro.png',
		'pressalert.ro': 'pressalert.ro.png',
		'primatv.ro': 'primatv.ro.png',
		'procinema.ro': 'procinema.ro.png',
		'profm.ro': 'profm.ro.png',
		'promotor.ro': 'promotor.ro.png',
		'prosport.ro': 'prosport.ro.jpg',
		'protv.ro': 'protv.ro.jpg',
		'protvplus.ro': 'protvplus.ro.png',
		'psychologies.ro': 'psychologies.ro.jpg',
		'qbebe.ro': 'qbebe.ro.jpg',
		'radardemedia.ro': 'radardemedia.ro.png',
		'radiodor.net': 'radiodor.net.png',
		'radiozu.ro': 'radiozu.ro.png',
		'realitatea.net': 'realitatea.net.png',
		'referat.ro': 'referat.ro.png',
		'renasterea.ro': 'renasterea.ro.png',
		'reteteculinare.ro': 'reteteculinare.ro.png',
		'retetefeldefel.ro': 'retetefeldefel.ro.png',
		'retetemerisor.ro': 'retetemerisor.ro.jpg',
		'retetepractice.ro': 'retetepractice.ro.png',
		'retetetimea.ro': 'retetetimea.ro.jpg',
		'revistaioana.ro': 'revistaioana.ro.png',
		'revistatango.ro': 'revistatango.ro.png',
		'rfi.ro': 'rfi.ro.png',
		'rockfm.ro': 'rockfm.ro.png',
		'romanialibera.ro': 'romanialibera.ro.png',
		'romaniatv.net': 'romaniatv.net.png',
		'romanticfm.ro': 'romanticfm.ro.png',
		'romedic.ro': 'romedic.ro.png',
		'sfatulmedicului.ro': 'sfatulmedicului.ro.jpg',
		'sfatulparintilor.ro': 'sfatulparintilor.ro.jpg',
		'sfin.ro': 'sfin.ro.png',
		'sport.ro': 'sport.ro.png',
		'sport1x2.ro': 'sport1x2.ro.png',
		'spynews.ro': 'spynews.ro.png',
		'stilmasculin.ro': 'stilmasculin.ro.png',
		'stiridesport.ro': 'stiridesport.ro.png',
		'stirilekanald.ro': 'stirilekanald.ro.png',
		'stirileprotv.ro': 'stirileprotv.ro.png',
		'stiripesurse.ro': 'stiripesurse.ro.jpg',
		'studentie.ro': 'studentie.ro.png',
		'suntmamica.ro': 'suntmamica.ro.png',
		'tasta.ro': 'tasta.ro.png',
		'teotrandafir.com': 'teotrandafir.com.png',
		'timesnewroman.ro': 'timesnewroman.ro.png',
		'tolo.ro': 'tolo.ro.jpg',
		'tpu.ro': 'tpu.ro.png',
		'trilulilu.ro': 'trilulilu.ro.png',
		'turdanews.net': 'turdanews.net.png',
		'turnulsfatului.ro': 'turnulsfatului.ro.jpg',
		'tvhappy.ro': 'tvhappy.ro.png',
		'tvmania.ro': 'tvmania.ro.jpg',
		'unica.ro': 'unica.ro.jpg',
		'urban.ro': 'urban.ro.jpg',
		'urbo.ro': 'urbo.ro.jpg',
		'verdict.ro': 'verdict.ro.png',
		'versuri.ro': 'versuri.ro.jpg',
		'vibefm.ro': 'vibefm.ro.png',
		'vip24.ro': 'vip24.ro.jpg',
		'virginradio.ro': 'virginradio.ro.png',
		'viteze.ro': 'viteze.ro.png',
		'viva.ro': 'viva.ro.png',
		'vocea.biz': 'vocea.biz.jpg',
		'voux.ro': 'voux.ro.png',
		'wall-street.ro': 'wall-street.ro.png',
		'wowbiz.ro': 'wowbiz.ro.png',
		'yoda.ro': 'yoda.ro.png',
		'zf.ro': 'zf.ro.png',
		'zi-de-zi.ro': 'zi-de-zi.ro.jpg',
		'ziare.com': 'ziare.com.jpg',
		'ziaruldeiasi.ro': 'ziaruldeiasi.ro.jpg',
		'ziarullumina.ro': 'ziarullumina.ro.jpg',
		'ziarulring.ro': 'ziarulring.ro.jpg',
		'zooland.ro': 'zooland.ro.png',
		'zutv.ro': 'zutv.ro.png'
	};

    function DynamicLoadingDetector(aliveTime) {
        function init() {
        	started_ = new Date().getTime();
            run_();
        }
        this["init"] = init;

        function finished(){
        	return !running;
        }
        this["finished"] = finished;

        function run_() {
        	running = 1;
        	if(window["en_cur_loc"]){
        		if(window.location.href != window["en_cur_loc"]){
        			window["en_cur_loc"] = window.location.href;
    				adtlgcen.util.makePageImpCall();
        		}
        	}else{
        		window["en_cur_loc"] = window.location.href;
        	}

            window.setTimeout(function(){
                run_();
            }, timeout_);

        }
        var timeout_ = 500;
        var started_ = new Date().getTime();
        var running = 0;
    };

    adtlgcen.util.isContent = function() {
		var result = document.getElementsByTagName("bi3dtext").length > 0;
		if(!result){
			 var allElements = document.getElementsByTagName('*');
			 for (var i = 0, n = allElements.length; i < n; i++){
				 if (attr = allElements[i].getAttribute("itemtype")){
				      if(attr=="http://schema.org/NewsArticle" || attr=="http://schema.org/Article"){
				    	  result = true;
				    	  break;
				      }
				 }
			 }
		}
		return result;
	};

    adtlgcen.util.send = function (url, skipExtraparams, pixelImage) {
    	if(!skipExtraparams){
    		url += "&evid=" + window[enr_vars.evid];
    		if(window[enr_vars.evid_v]){
    			url += "&vv=" + window[enr_vars.evid_v];
    		}
    		url += adtlgcen_SETTINGS.SCRIPT_VERSION_PARAMETER;
    	}

        if(pixelImage){
			setTimeout(function(){
				var imgRequest = new Image(0, 0);
				imgRequest.src = url;
			},100);
			return;
		}

        if (navigator.appVersion.indexOf("MSIE") != -1 ) {
			var version = parseFloat(navigator.appVersion.split("MSIE")[1]);
		    if(version<8){
				setTimeout(function(){
					var request = new Image(0, 0);
					request.src = url;
				},1000);
				return;
		    }
	 	}

		var result = false;
		if (!result && typeof XDomainRequest!='undefined') {
			result = new XDomainRequest();
		}
		if (!result && typeof XMLHttpRequest!='undefined') {
			try {
				result = new XMLHttpRequest();
			} catch (e) {
				result=false;
			}
		}
	    if (!result && window.createRequest) {
	    	try {
	    		result = window.createRequest();
	    	} catch (e) {
	    		result=false;
	    	}
	    }
		if(result){
			result.open("GET", url,true);
			result.send('');
		}
		return result;
    };

    adtlgcen.util.validateEvIdCookie = function (evIdCookieName) {
    	var evidCookie = adtlgcen_Cookie.get(evIdCookieName);
        return evidCookie && evidCookie != "-entered" && evidCookie.search(/^[a-zA-Z0-9-_\:]+$/)!=-1;
    };

    adtlgcen.util.en_smart_decode = function(url){
    	var tokens = url.split("%");
    	var result = tokens[0];
    	for(var i=1; i< tokens.length; i++){
    		try{
    			if(tokens[i].length==2 && tokens.length > i && tokens[i+1].length>=2){
    				try{
    					result+=decodeURIComponent("%"+tokens[i]+"%"+tokens[i+1].substring(0,2));
    					result+=tokens[i+1].substring(2, tokens[i+1].length);
    					i++;
    					continue;
    				}catch(e){
    					//ignore
    				}
    			}
    			if(tokens[i].length>=2){
    				result+=decodeURIComponent("%"+tokens[i].substring(0,2))+tokens[i].substring(2, tokens[i].length);
    				continue;
    			}
    		}catch(e){
    			//ignore
    		}
    		result+="%"+tokens[i];
    	}
    	return result;
    };

	adtlgcen.util.makePageImpCall = function () {
		var statURL = adtlgcen_SETTINGS.TC_URL + "/event/v3/pagestat?location=" +
			(encodeURIComponent || escape)(window.loc_.href) +
			(adtlgcen.util.isContent() ? "&isContent=1" : "") +
			"&cb=" + new Date().getTime();
			adtlgcen.util.send(statURL);

		if(window[enr_vars.evid]=="optout"){
    		return;
    	}

		if(adtlgcen.util.validateEvIdCookie(enr_vars.evid) && adtlgcen.util.survey.isUserFromPool()){
			adtlgcen.util.getSurveyData();
		}


        //var result = adtlgcen.util.en_smart_decode(window.loc_.href);
        //statURL = adtlgcen_SETTINGS.TC_URL + "/event/v3/arstat?location="+(encodeURIComponent||escape)(result)+"&cb="+new Date().getTime();
        //adtlgcen.util.send(statURL);

    	if(adtlgcen.util.validateEvIdCookie(enr_vars.evid)){
    		var throttleCookie = "enr_cxense_throttle";
            var minTimeBetweenUpdatesDays = 7;

            var segments = adtlgcen_Cookie.get(enr_vars.adptseg).replace(/-/g, "|").split("|");
    		if(segments && segments.length > 0 && segments[0]){
				cX.callQueue.push(['invoke', function() {
				    if (!cX.getCookie(throttleCookie)) {
				    	var params = [];
		    			for(var i=0;i < enr_vars.cxPrefixes.length; i++){
		    				var prefix = enr_vars.cxPrefixes[i];

		    				var profile = [];
	    	        		for(var j=0; j < segments.length;j++){
	    	        			var curSegTokens = segments[j].split("#");
	    	        			if(segmentGroups[curSegTokens[0]]){
		    	        			var segmentValue = segmentValues[segments[j].replace("#","=")];
    	        					if(segmentValue){
	    	        					profile[profile.length] = {'item': segmentValue, 'group': prefix + segmentGroups[curSegTokens[0]]};
	    	        				}
	    	        			}
	    	        		}

	    	        		if(profile.length>0){
	    	        			params[params.length] = {"id": adtlgcen_Cookie.get(enr_vars.evid), "cxid": cX.getUserId(), "profile":profile, "type": prefix };
	    	        		}
		    			}

		    			if(params.length > 0){
					        var apiUrl = 'https://api.cxense.com/profile/user/external/update?callback={{callback}}'
					                + '&persisted=' + encodeURIComponent(enr_vars.persistedUpdateQueryId)
					                + '&json=' + encodeURIComponent(cX.JSON.stringify(params));
					        cX.jsonpRequest(apiUrl, function(data) {
					            //alert(cX.JSON.stringify(data))
					        });
					        cX.setCookie(throttleCookie, "throttle", minTimeBetweenUpdatesDays);
		    			}
				    }
				}]);
    		}
    	}
    };

    window.admp_ = new function () {
    };

	adtlgcen.util.getSurveyData = function(){
		function run(){
			var requestObj = {"action":"getSurvey","origin":window.loc_.origin};
			requestObj["enr_vars"] = enr_vars;
			document.getElementById("enGlobalIframe").contentWindow.postMessage(JSON.stringify(requestObj), window.loc_.protocol + "//code3.adtlgc.com");
		}
		if(document.getElementById("enGlobalIframe")){
			run();
		}else{
			adtlgcen.util.createSyncIFrame("enGlobalIframe", window.loc_.protocol + "//code3.adtlgc.com/js/survey.html", function(){
				run();
			});
		}
	};

	adtlgcen.util.setSurveyData = function(surveySet, surveyCycle, surveyStartDate, lastCycleDate, lastCycleDomain){
		window[enr_vars.survey_set] = surveySet;
		window[enr_vars.survey_cycle] = surveyCycle;
		var requestObj = {"action":"setSurvey","origin":window.loc_.origin};
		requestObj["enr_vars"] = enr_vars;
		requestObj["surveySet"] = surveySet;
		requestObj["surveyStartDate"] = surveyStartDate;
		requestObj["surveyCycle"] = surveyCycle;
		if(surveyCycle){
			requestObj["lastCycleDate"] = lastCycleDate;
			requestObj["lastCycleDomain"] = lastCycleDomain;
		}
		document.getElementById("enGlobalIframe").contentWindow.postMessage(JSON.stringify(requestObj), window.loc_.protocol + "//code3.adtlgc.com");
	};

	adtlgcen.util.createSyncIFrame = function(id, src, onloadHandler) {
		if(!src){
			return;
		}
		if(!document.body){
			setTimeout(function(){
                adtlgcen.util.createSyncIFrame(id, src, onloadHandler);
            }, 200);
		}else{
			var iframeEl = document.createElement('iframe');
			if (onloadHandler) {
				if(iframeEl.addEventListener)
					iframeEl.addEventListener('load', onloadHandler, true);
				else if(iframeEl.attachEvent)
					iframeEl.attachEvent('onload',onloadHandler);
			}
			if (id) {
				iframeEl.id = id;
				iframeEl.name = id;
			}
			iframeEl.width = 0;
			iframeEl.height = 0;
			iframeEl.scrolling = 'no';
			iframeEl.frameBorder = 0;
			iframeEl.src = src;
			iframeEl.style.display = 'none';
			document.body.appendChild(iframeEl);
			return iframeEl;
		}
	};

    adtlgcen.util.survey.onStart = function(hasLogo, showEnglish){
    	var survey_url = adtlgcen_SETTINGS.SURVEY_URL;
    	if(showEnglish == 1 || (showEnglish == 0 && document.domain == "business-review.eu")){
    	    survey_url = adtlgcen_SETTINGS.SURVEY_URL_EN;
    	}
    	survey_url += "&respondent="+window[enr_vars.evid];

    	adtlgcen.util.survey.recordStat(true, window[enr_vars.survey_cycle]);

    	var auditURL = adtlgcen_SETTINGS.TC_URL + "/audit-log?action=survey-start&date=" + new Date().getTime() +
    		"&hasLogo=" + hasLogo + "&site=" + document.domain;
    	adtlgcen.util.send(auditURL);

    	auditURL = adtlgcen_SETTINGS.TC_URL + "/event/v3/sati?action=survey-start&date=" + new Date().getTime() +
			"&hasLogo=" + hasLogo + "&site=" + document.domain;
    	adtlgcen.util.send(auditURL);

    	//window.location.href = survey_url;
    	var redirectWindow = window.open(survey_url, '_blank');
        redirectWindow.location;
        document.getElementById('sg-popup').style.display = 'none';

    	return false;
    };

    adtlgcen.util.survey.onCancel = function(hasLogo){
    	adtlgcen.util.survey.recordStat(false, window[enr_vars.survey_cycle]);

    	document.getElementById('sg-popup').style.display = 'none';

    	var auditURL = adtlgcen_SETTINGS.TC_URL + "/audit-log?action=survey-cancel&date=" + new Date().getTime() +
    		"&hasLogo=" + hasLogo + "&site=" + document.domain;
    	adtlgcen.util.send(auditURL);

    	auditURL = adtlgcen_SETTINGS.TC_URL + "/event/v3/sati?action=survey-cancel&date=" + new Date().getTime() +
			"&hasLogo=" + hasLogo + "&site=" + document.domain;
		adtlgcen.util.send(auditURL);

		return false;
	};

    adtlgcen.util.survey.recordStat = function(surveyTaken, surveyCycle){
    	if(surveyCycle >= adtlgcen_SETTINGS.MAX_SURVEY_CYCLES || surveyTaken){
    		adtlgcen.util.setSurveyData(1, surveyCycle, window[enr_vars.survey_start_date], new Date().getTime(), document.domain);
    	}else{
    		adtlgcen.util.setSurveyData(0, surveyCycle, window[enr_vars.survey_start_date], new Date().getTime(), document.domain);
    	}
    };

    adtlgcen.util.survey.getSurveyTemplate = function(logoURL, surveyCycle){
        var SATI_logoURL = "https://code3.adtlgc.com/resources/sati/SATI_logo.png";
        var surveyTemplate = "", header = "", description1 = "", description2 = "";
        var templateNumber = Math.floor(Math.random() * 4) + 1;

        //DEBUG CODE START
        if(document.location.href.indexOf("type=general")>0){
            templateNumber = 1;
        }else if(document.location.href.indexOf("type=man")>0){
            templateNumber = 2;
        }else if(document.location.href.indexOf("type=woman")>0){
            templateNumber = 3;
        }else if(document.location.href.indexOf("type=youth")>0){
            templateNumber = 4;
        //DEBUG CODE END
        }else if(surveyCycle==0){
            templateNumber = 1;
        }

        switch(templateNumber){
            case 1:
                //General
                surveyTemplate = "scheme-light-blue";
                header = "V&#259; rug&#259;m s&#259; ne ajuta&#539;i s&#259; m&#259;sur&#259;m audien&#539;a ";
                description1 = "A&#539;i fost selectat s&#259; participa&#539;i la studiul mediului online din Rom&#226;nia:";
                description2 = "V&#259; invit&#259;m s&#259; ne r&#259;spunde&#539;i la urm&#259;toarele &#238;ntreb&#259;ri, dureaz&#259; doar c&#226;teva minute.";
                break;
            case 2:
                //Man
                surveyTemplate = "scheme-blue";
                header = "Ajut&#259;-ne s&#259; m&#259;sur&#259;m audien&#539;a ";
                description1 = "Ai fost ales pentru a participa la studiul mediului online din Rom&#226;nia:";
                description2 = "Acord&#259;-ne c&#259;teva minute pentru a r&#259;spunde la &#238;ntreb&#259;rile urm&#259;toare.";
                break;
            case 3:
                //Woman
                surveyTemplate = "scheme-pink";
                header = "Ajut&#259;-ne s&#259; m&#259;sur&#259;m audien&#539;a ";
                description1 = "Ai fost aleas&#259; pentru a participa la studiul mediului online din Rom&#226;nia:";
                description2 = "R&#259;spunsul t&#259;u la &#238;ntreb&#259;rile urm&#259;toare este valoros, te rug&#259;m s&#259; ne acorzi c&#226;teva minute.";
                break;
            case 4:
                //Youth
                surveyTemplate = "scheme-yellow";
                header = "Ajut&#259;-ne s&#259; m&#259;sur&#259;m audien&#539;a ";
                description1 = "Ai fost ales pentru a participa la studiul mediului online din Rom&#226;nia";
                description2 = "Te rug&#259;m s&#259; ne r&#259;spunzi la &#238;ntreb&#259;rile urm&#259;toare, dureaz&#259; doar c&#226;teva minute.";
                break;
        }

        var tempalteChunks = [
            '<div class="sati-survey '+surveyTemplate+'">',
            '<div class="sati-survey-header">',
            '<a class="_brand" href="./">',
            '<img src="'+(logoURL ? logoURL : SATI_logoURL) + '">',
            '</a>',
            '<a class="_brand" href="https://www.brat.ro/">',
            '<img src="https://code3.adtlgc.com/resources/sati-survey/SATI_brand.png">',
            '</a>',
            '<button class="_close" type="button" onclick="return adtlgcen.util.survey.onCancel('+(logoURL ? 1 : 0)+')">x</button>',
            '</div>',
            '<div class="sati-survey-body">',
            '<div class="sati-survey-hero">',
            '<div class="sati-survey-hero-header">',
            '<h1 class="_title">',
            '<span>' + header + window.location.hostname + '</span>',
            '</h1>',
            '</div>',
            '<div class="sati-survey-hero-body">',
            '<p class="_description">'+description1+'</p>',
            '<h2 class="_title">Studiul de Audien&#539;&#259; &#537;i Trafic Internet</h2>',
            '<p class="_description">'+description2+'</p>',
            '<div class="sati-survey-hero-group">',
            '<div class="_image"></div>',
            '<div class="sati-survey-btn-col">',
            '<div class="sati-survey-button-group">',
            '<a class="_link" href="#" onclick="return adtlgcen.util.survey.onStart('+(logoURL ? 1 : 0)+',0)">COMPLETEAZ&#258;   </a>',
            '<a href="#" onclick="return adtlgcen.util.survey.onStart('+(logoURL ? 1 : 0)+',-1)" style="display:inline-block;vertical-align:middle;margin-left:8px">',
            '<img src="https://code3.adtlgc.com/resources/sati-survey/romanian.png" style="height:40px;display:block;" /></a>',
            '</div>',
            '<div class="sati-survey-button-group">',
            '<a class="_link" href="#" onclick="return adtlgcen.util.survey.onStart('+(logoURL ? 1 : 1)+',1)">COMPLETE</a>',
            '<a href="#" onclick="return adtlgcen.util.survey.onStart('+(logoURL ? 1 : 0)+',1)" style="display:inline-block;vertical-align:middle;margin-left:8px">',
            '<img src="https://code3.adtlgc.com/resources/sati-survey/english.png" style="height:40px;display:block;" /></a>',
            '</div>',
            '</div>',
            '</div>',
            '</div>',
            '<div class="sati-survey-hero-footer">',
            '<h2 class="_title">V&#259; mul&#355;umim!</h2>',
            '<p class="_description">Pentru informa&#539;ii despre datele cu caracter personal, v&#259; rug&#259;m s&#259; da&#539;i click <a style="display:inline" href="https://www.brat.ro/">aici</a>.',
            '</p>',
            '</div>',
            '</div>',
            '</div>',
            '</div>',
        ];


        return tempalteChunks.join('');
    };

    adtlgcen.util.survey.show = function(){
    	var sg_div = document.createElement("div");
    	var logoURL = "";
    	for(var key in survey_logos){
			if(window.location.hostname.replace("www.","").indexOf(key) === 0 || window.location.hostname.replace("m.","").indexOf(key) === 0
					|| window.location.hostname.indexOf("."+key) > 0 ){
				logoURL = "https://code3.adtlgc.com/resources/sati/"+ survey_logos[key];
				break;
			}
		}

		var surveyCycle = 0 || window[enr_vars.survey_cycle];

		var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://code3.adtlgc.com/resources/sati-survey/SATI_survey.css';
        head.appendChild(link);

	    var sg_div = document.createElement("div");
	    sg_div.innerHTML = adtlgcen.util.survey.getSurveyTemplate(logoURL, surveyCycle);
	    sg_div.id = "sg-popup";

	    document.body.appendChild(sg_div);

    	surveyCycle = 1 + parseInt(surveyCycle);
	    adtlgcen.util.survey.recordStat(false, surveyCycle);

	    var auditURL = adtlgcen_SETTINGS.TC_URL + "/audit-log?action=survey-show&date=" + new Date().getTime() +
    		"&hasLogo=" + ( logoURL ? "1" : "0") + "&site=" + document.domain;
    	adtlgcen.util.send(auditURL);

    	auditURL = adtlgcen_SETTINGS.TC_URL + "/event/v3/sati?action=survey-show&date=" + new Date().getTime() +
			"&hasLogo=" + ( logoURL ? "1" : "0") + "&site=" + document.domain;
		adtlgcen.util.send(auditURL);
    };

    adtlgcen.util.survey.isUserFromPool = function(){
        //DEBUG CODE START
        if(document.location.href.indexOf("force_survey_invite=true")>0){
            return true;
        }
        //DEBUG CODE END
        if(adtlgcen.util.validateEvIdCookie(enr_vars.evid) && !window[enr_vars.survey_set]){
            var segments = adtlgcen_Cookie.get(enr_vars.adptseg).replace(/-/g, "|").split("|");
            if(segments && segments.length > 0 && segments[0]){
                for(var i=0;i<segments.length;i++){
                    if(adtlgcen_SETTINGS.SURVEY_VISITOR_SEGMENT == segments[i]){
                        return true;
                    }
                }
            }
        }
        return false;
    };

    adtlgcen.util.survey.run = function(){
        //DEBUG CODE START
        if(document.location.href.indexOf("force_survey_invite=true")>0){
            adtlgcen.util.survey.show();
            return;
        }
        //DEBUG CODE END
    	if(parseInt(window[enr_vars.survey_set]) == 0){
            var startDate = 0;
            if(!window[enr_vars.survey_start_date]){
                startDate = Math.floor(Math.random() * 15) + 1;
                window[enr_vars.survey_start_date] = startDate;
                adtlgcen.util.setSurveyData(0, window[enr_vars.survey_cycle], startDate);
            }else{
                startDate = parseInt(window[enr_vars.survey_start_date]);
            }
            var now = new Date();
            if(now.getDate() < startDate){
                //DEBUG START
                var auditURL = adtlgcen_SETTINGS.TC_URL + "/audit-log?action=survey-block-date&date=" + new Date().getTime() + "&site=" + document.domain;
                adtlgcen.util.send(auditURL);
                //DEBUG END
                return;
            }
            if( window[enr_vars.last_survey_cycle_date]){
                var hours = Math.abs(now - new Date(parseInt(window[enr_vars.last_survey_cycle_date]))) / 36e5;
                if(adtlgcen_SETTINGS.MIN_HOURS_BETWEEN_CYCLES > hours){
                    //DEBUG START
                    var auditURL = adtlgcen_SETTINGS.TC_URL + "/audit-log?action=survey-block-cycle&date=" + new Date().getTime() + "&site=" + document.domain;
                    adtlgcen.util.send(auditURL);
                    //DEBUG END
                    return;
                }
            }
            if(document.domain == window[enr_vars.last_survey_cycle_domain]){
                //DEBUG START
                var auditURL = adtlgcen_SETTINGS.TC_URL + "/audit-log?action=survey-block-domain&date=" + new Date().getTime() + "&site=" + document.domain;
                adtlgcen.util.send(auditURL);
                //DEBUG END
                return;
            }

            adtlgcen.util.survey.show();
        }else{
            //DEBUG START
            var auditURL = adtlgcen_SETTINGS.TC_URL + "/audit-log?action=survey-block-taken&date=" + new Date().getTime() + "&site=" + document.domain;
            adtlgcen.util.send(auditURL);
            //DEBUG END
        }
    };

    adtlgcen.util.optOut = function(){
    	adtlgcen_Cookie.set(enr_vars.evid+"_optout", 1, 90 * 24); //90 days

    	var auditURL = adtlgcen_SETTINGS.TC_URL + "/audit-log?action=optout&date=" + new Date().getTime() + "&site=" + document.domain;
		adtlgcen.util.send(auditURL);

    	adtlgcen_Cookie.set(enr_vars.evid, "optout", 90 * 24); //90 days
		adtlgcen_Cookie.unset(enr_vars.evid_v);
		adtlgcen_Cookie.unset(enr_vars.adptseg);
		adtlgcen_Cookie.unset(enr_vars.adptset);
		window[enr_vars.evid] = "optout";

		/*
		adtlgcen.util.createSyncIFrame("enGlobalIframe", window.loc_.protocol + "//code3.adtlgc.com/js/global.html", function(){
			var requestObj = {"action":"optOut","origin":window.loc_.origin};
			requestObj["enr_vars"] = enr_vars;
			requestObj["enr_settings"] = adtlgcen_SETTINGS;
			document.getElementById("enGlobalIframe").contentWindow.postMessage(JSON.stringify(requestObj), window.loc_.protocol + "//code3.adtlgc.com");
		});

		var url = adtlgcen_SETTINGS.TC_URL + "/getCampaigns.do?includeSegments=false&cb=" + new Date().getTime();
        window[enr_vars.dataRequest].send(url, true);
		*/
    };

    adtlgcen.util.optIn = function(){
        if (adtlgcen.util.validateEvIdCookie(enr_vars.evid) && window[enr_vars.evid]!="optout") {
            return;
        }
    	var auditURL = adtlgcen_SETTINGS.TC_URL + "/audit-log?action=optin&date=" + new Date().getTime() + "&site=" + document.domain;
		adtlgcen.util.send(auditURL);

		adtlgcen_Cookie.unset(enr_vars.evid);
        adtlgcen_Cookie.unset(enr_vars.adptset);
        window[enr_vars.evid] = "-entered";

        var createNewUserIfNotExist = window[enr_vars.cxid] ? "0" : "1";
        var url = adtlgcen_SETTINGS.TC_URL + "/user?nw="+createNewUserIfNotExist+"&cm=0&sg=0&callback=" + enr_vars.dataRequest + ".campaignCallback&cb=" + new Date().getTime();
        if(window[enr_vars.cxid]){
            window[enr_vars.evid] = window[enr_vars.cxid];
            window[enr_vars.dataRequest].send(url, true);
        }else{
            window[enr_vars.dataRequest].send(url, false);
        }
    };

    adtlgcen.util.processTaskQueue = function(){
    	var task = adtlgcen.taskQueue.pop();
    	while(task){
    		if("optOut"==task){
    			adtlgcen.util.optOut();
    		}else if("optIn"==task){
    			adtlgcen.util.optIn();
    		}
    		task = adtlgcen.taskQueue.pop();
    	}
    	window.setTimeout(function(){
    		adtlgcen.util.processTaskQueue();
        }, 1000);
    };

	admp_.init = function() {
	    if(this._initialized){
            return;
        }
        this._initialized = true;

        window[enr_vars.evid] = adtlgcen_Cookie.get(enr_vars.evid);
        window[enr_vars.evid_v] = adtlgcen_Cookie.get(enr_vars.evid_v);

        if ("1" != adtlgcen_Cookie.get(enr_vars.adptset) && window[enr_vars.evid]!="optout") {
            adtlgcen.config.skipPageImp = true;
            adtlgcen_Cookie.set(enr_vars.evid_set, 1, 1 / 60);
            var sendEvid = window[enr_vars.cxid] ? "0" : "1";
            var url = adtlgcen_SETTINGS.TC_URL + "/user?nw="+sendEvid+"&cm=1&sg=1&callback=" + enr_vars.dataRequest + ".campaignCallback&cb=" + new Date().getTime();
            window[enr_vars.dataRequest].send(url, sendEvid);
        }

        if (adtlgcen.util.validateEvIdCookie(enr_vars.evid)) {
            adtlgcen_Cookie.set(enr_vars.evid_set, 2, 1 / 60);
        }

        if (!adtlgcen.config.skipPageImp) {
            adtlgcen.util.makePageImpCall();
        }

        admp_.dynamicLoadingDetector = new DynamicLoadingDetector;
        admp_.dynamicLoadingDetector.init();

        adtlgcen.util.processTaskQueue();

        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        eventer(messageEvent, function (e) {
        	try{
        		var responseObj = JSON.parse(e.data);

                if(responseObj["action"]=="getSurvey"){
        			window[enr_vars.survey_set] = responseObj["surveySet"];
        			window[enr_vars.survey_cycle] = responseObj["surveyCycle"];
        			window[enr_vars.last_survey_cycle_date] = responseObj["lastCycleDate"];
        			window[enr_vars.last_survey_cycle_domain] = responseObj["lastCycleDomain"];
        			window[enr_vars.survey_start_date] = responseObj["surveyStartDate"];
        			if(responseObj["3rdPartyBlock"]){
        			    //DEBUG
        			    var auditURL = adtlgcen_SETTINGS.TC_URL + "/audit-log?action=survey-block-3rd&date=" + new Date().getTime() + "&site=" + document.domain;
                        adtlgcen.util.send(auditURL);
        			}else{
        				adtlgcen.util.survey.run();
        			}
        		}
        	}catch(e){
        		//ignore
        	}
        }, false);
    };

	function DataRequest(functionInstance) {
        this.fn = functionInstance;

        this.send = function (url, sendEvid) {
        	if (sendEvid) {
        		url += "&evid=" + window[enr_vars.evid];
        	}
            url += adtlgcen_SETTINGS.SCRIPT_VERSION_PARAMETER;

            var scriptNode = document.createElement("script");
            scriptNode.setAttribute("type", "text/javascript");
            scriptNode.setAttribute("charset", "utf-8");
            scriptNode.setAttribute("src", url);
            document.getElementsByTagName("head")[0].appendChild(scriptNode);
        };

        this.campaignCallback = function (data) {
            var forceInvalidate = false;
			if (data) {
                if(!data["id"] || data["id"]=="-entered"){
                    if(window[enr_vars.cxid]){
                        data["id"] = window[enr_vars.cxid];
                        window[enr_vars.evid] = window[enr_vars.cxid];
                        forceInvalidate = true;
                    }
                }
                adtlgcen_Cookie.set(enr_vars.evid, data["id"], 90 * 24); //90 days
                if(data["vv"]){
                	adtlgcen_Cookie.set(enr_vars.evid_v, data["vv"], 90 * 24);
                }
            }
        	if (adtlgcen.util.validateEvIdCookie(enr_vars.evid) && !forceInvalidate) {
				adtlgcen_Cookie.set(enr_vars.adptset, "1", 2);
	            window[enr_vars.evid] = adtlgcen_Cookie.get(enr_vars.evid);
	            window[enr_vars.evid_v] = adtlgcen_Cookie.get(enr_vars.evid_v);

	            var segmentsData = data["segm"];
                if (segmentsData) {
                	var segments = "";
                    for (var i = 0; i < segmentsData.length; i++) {
                        if (segmentsData[i]) {
                            if(segments){
                        		segments+=";";
                        	}
                            segments += segmentsData[i];
                        }
                    }
                    if (segments) {
                        adtlgcen_Cookie.set(enr_vars.adptseg, segments.replace(/;/g, "-").replace(/=/g, "#"), 2);
                    }
                }

                adtlgcen.util.makePageImpCall();
	        } else {
    	        var url = adtlgcen_SETTINGS.TC_URL + "/user?nw=1&cm=0&sg=0&callback=" + enr_vars.dataRequest + ".validateCallback&cb=" + new Date().getTime();
        	    window[enr_vars.dataRequest].send(url, forceInvalidate);
            }
        };

        this.validateCallback = function (data) {
            if (data) {
                adtlgcen_Cookie.set(enr_vars.evid, data["id"], 90 * 24);
                if(data["vv"]){
                	adtlgcen_Cookie.set(enr_vars.evid_v, data["vv"], 90 * 24);
                }
                window[enr_vars.evid] = adtlgcen_Cookie.get(enr_vars.evid);
                window[enr_vars.evid_v] = adtlgcen_Cookie.get(enr_vars.evid_v);

				adtlgcen_Cookie.set(enr_vars.adptset, "1", 2);
				adtlgcen_Cookie.set(enr_vars.evid_set, 2, 1/60);
                adtlgcen.util.makePageImpCall();
            }
        };
    };

    window[enr_vars.dataRequest] = new DataRequest(admp_);

    //start script execution once Cxense global id is available
    window[enr_vars.evid] = adtlgcen_Cookie.get(enr_vars.evid);
    if(!window[enr_vars.evid] || window[enr_vars.evid]=="-entered"){
        adtlgcen_Cookie.set(enr_vars.evid_set, "1", 1/60); //1 min
        setTimeout(function(){admp_.init()},2500);
        cX.callQueue.push(["invoke", function() {
           (function exec(maxIterations){
                if(maxIterations==0){
                    return;
                }
                if(cX.getCxenseUserId && cX.getCxenseUserId()){
                    if(!cX.isConsentRequired() || (cX.isConsentRequired() && cX.hasConsent("pv"))){
                        window[enr_vars.cxid] = cX.getCxenseUserId();
                    }else{
                        window[enr_vars.evid]="optout";
                        adtlgcen_Cookie.set(enr_vars.evid, "optout", 90 * 24); //90 days
                    }
                    admp_.init();
                }else{
                    setTimeout(function(){exec(--maxIterations)}, 50);
                }
            }(50));
        }]);
    }else{
        admp_.init();
    }
}