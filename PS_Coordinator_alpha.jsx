//
// Coordinator �s�@��
//
if (app.documents.length > 0)
	var doc = app.activeDocument; //�Y�w���ɮ׶}�ҡA���N���ɮ׳]�����椤�ɮ�
else {
	alert('No doc opened.');
	//return;
}

var t = new Date().getTime();
var finalArray = [];
var textStyleArray = [];
var txtMark = 0;
var savePath = new Folder(decodeURI(app.activeDocument.path)+'/pic')
var pngName = "";	
var opts, file;
opts = new ExportOptionsSaveForWeb();
opts.format = SaveDocumentType.PNG;
opts.PNG8 = false;
opts.quality = 100;

var t = new Date().getTime();

if(!savePath.exists) savePath.create();		//���o�Ҧ���Ƨ�
var rootSets = getLayerSets();

for(i in rootSets){
	var refRn = new ActionReference();
	var rootIdx = rootSets[i][0];
	
	//var layerName = getLayerNameByIndex(rootIdx);
	refRn.putIndex(charIDToTypeID('Lyr '), rootIdx);
	
	//���root group
	// var list4 = new ActionList();
	// list4.putReference( refRn );
	// var desc205 = new ActionDescriptor();
	// desc205.putList( charIDToTypeID( "null" ), list4 );			
	// executeAction( charIDToTypeID( "Shw " ), desc205, DialogModes.NO );
	
	//�I��root�ϼh
	// var ref68 = new ActionReference();
	// ref68.putIndex( charIDToTypeID( "Lyr " ), rootIdx );
	// var desc71 = new ActionDescriptor();
	// desc71.putReference( charIDToTypeID( "null" ), ref68 );
	// executeAction( charIDToTypeID( "slct" ), desc71, DialogModes.NO );
	
	
	rootChildIdx = getChildIndex(rootIdx, false);		//false = �����L�l����
	var skipidx = 0;
	for(j in rootChildIdx){
		if(rootChildIdx[j] < skipidx) continue;			//
		var layerProperty = [];
		layerProperty.push(getLayerNameByIndex(rootChildIdx[j]));		//�s�J�ϼh�W��
		
		if(layerProperty[0].split(' ')[0] == '-' ){						//�p�G���ϼh�W�٫e��-
			if(isGroup(rootChildIdx[j])){								//�p�G���ϼh�O��Ƨ�
				skipidx = skipNestedSets(rootChildIdx[j]);				//skipidx�]����eindex
			}				
		} else {
			if(!hasLayerMask(rootChildIdx[j]))	makeContentMask(rootChildIdx[j]);		//�p�G�S���B�n�I�s�B�n�禡
			layerProperty.push(getMaskBounds(rootChildIdx[j]));							//�s�J�ϼhbounds
			for(f in finalArray){
				if()
			}
			
		}		
	}
	
	function getMaskBounds(idx){		
		//����B�n
		var ref153 = new ActionReference();
		ref153.putProperty( charIDToTypeID( "Chnl" ), charIDToTypeID( "fsel" ) );
		
		var ref154 = new ActionReference();
		ref154.putEnumerated( charIDToTypeID( "Chnl" ), charIDToTypeID( "Chnl" ), charIDToTypeID( "Msk " ) );
		ref154.putIndex(charIDToTypeID('Lyr '), rootIdx);
		
		var desc146 = new ActionDescriptor();
		desc146.putReference( charIDToTypeID( "null" ), ref153 );
		desc146.putReference( charIDToTypeID( "T   " ), ref154 );
		executeAction( charIDToTypeID( "setd" ), desc146, DialogModes.NO );
		
		var layerbounds = activeDocument.selection.bounds;
		var width = layerbounds[2] - layerbounds[0];
		var height = layerbounds[3] - layerbounds[1];
		return width,height;
	}
	if(hasVectorMask()){			
		var ref259 = new ActionReference();
		ref259.putEnumerated( charIDToTypeID( "Path" ), charIDToTypeID( "Path" ), stringIDToTypeID( "vectorMask" ) );
		ref259.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
		
		var desc261 = new ActionDescriptor();
		desc261.putReference( charIDToTypeID( "null" ), ref259 );
		executeAction( charIDToTypeID( "slct" ), desc261, DialogModes.NO );	

		cropToSelection();
	}		
	
	if (rootSets[i].length > 1){
		for(j in rootSets[i]){
			if(j == 0) continue;
			var refB = new ActionReference();
			refB.putIndex(charIDToTypeID('Lyr '), rootSets[i][j]);
			var descBn = executeActionGet(refB);
			var layerName = descBn.getString(charIDToTypeID('Nm  ')).split(' ')[1];
			//���branch group
			var listB = new ActionList();
			listB.putReference( refB );
			var descB = new ActionDescriptor();
			descB.putList( charIDToTypeID( "null" ), listB );			
			executeAction( charIDToTypeID( "Shw " ), descB, DialogModes.NO );
			//�sPNG
			pngName = savePath + "/" + layerName.toLowerCase() + ".png"
			doc.exportDocument(new File(pngName), ExportType.SAVEFORWEB, opts);
			//����branch
			executeAction( charIDToTypeID( "Hd  " ), descB, DialogModes.NO );
		}
	}else{
		pngName = savePath + "/" + layerName.toLowerCase() + ".png"
		doc.exportDocument(new File(pngName), ExportType.SAVEFORWEB, opts);
	}
	
	//�p�G��eroot���B�n��crop�N�^�_�W���
	if(hasVectorMask(rootIdx) || hasLayerMask(rootIdx)){
		var desc264 = new ActionDescriptor();
		var ref263 = new ActionReference();
		ref263.putOffset( charIDToTypeID( "HstS" ), -2 );
		desc264.putReference( charIDToTypeID( "null" ), ref263 );
		executeAction( charIDToTypeID( "slct" ), desc264, DialogModes.NO );
	}
	//���ùϼh
	executeAction( charIDToTypeID( "Hd  " ), desc205, DialogModes.NO );		
}
t = new Date().getTime() - t;
alert('end \n time: '+ t/1000 + ' sec')



function makeContentMask(idx){
	// =======================================================
	var ref8 = new ActionReference();
	ref8.putProperty(charIDToTypeID("Chnl"), charIDToTypeID("fsel"));
	
	var desc9 = new ActionDescriptor();
	desc9.putReference(charIDToTypeID("null"), ref8);
	
	var ref9 = new ActionReference();
	ref9.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Trsp"));
	ref9.putIndex(charIDToTypeID('Lyr '), idx);

	desc9.putReference(charIDToTypeID("T   "), ref9);
	executeAction(charIDToTypeID("setd"), desc9, DialogModes.NO);
	// =======================================================
	var desc10 = new ActionDescriptor();
	desc10.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
	
	var ref10 = new ActionReference();
	ref10.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
	ref10.putIndex(charIDToTypeID('Lyr '), idx);
	desc10.putReference(charIDToTypeID("At  "), ref10);
	
	desc10.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
	executeAction(charIDToTypeID("Mk  "), desc10, DialogModes.NO);
	// =======================================================
}


function replaceText(From, To) {
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putProperty(stringIDToTypeID('property'), stringIDToTypeID('replace'));
	ref.putEnumerated(charIDToTypeID('TxLr'), charIDToTypeID('Ordn'), stringIDToTypeID('allEnum'));
	desc.putReference(charIDToTypeID('null'), ref);
	
	var desc2 = new ActionDescriptor();
	desc2.putString(stringIDToTypeID('find'), From);
	desc2.putString(stringIDToTypeID('replace'), To);
	//If checkAll == true all text layers are scaned and changed if a match is found
	desc2.putBoolean(stringIDToTypeID('checkAll'), true);
	desc2.putBoolean(charIDToTypeID('Fwd '), true);
	desc2.putBoolean(stringIDToTypeID('caseSensitive'), false);
	desc2.putBoolean(stringIDToTypeID('wholeWord'), false);
	desc2.putBoolean(stringIDToTypeID('ignoreAccents'), true);
	
	desc.putObject(charIDToTypeID('Usng'), stringIDToTypeID('findReplace'), desc2);
	try {
		executeAction(stringIDToTypeID('replace'), desc, DialogModes.NO);
	} catch (e) {}
};

function getLayerSets() { 
	var ref = new ActionReference();
	ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID('NmbL'));
	ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
	var count = executeActionGet(ref).getInteger(charIDToTypeID('NmbL')) + 1;
	var rootLsets = [];
	var nested = 0;
	var rootTemp = [];
	try {
		activeDocument.backgroundLayer;
		var i = 0;
	} catch (e) {
		var i = 1;
	};
	//loop �Ҧ��ϼh
	for (i; i < count; i++) {
		if (i == 0)	continue;	//continue ���U�������檽���^for����P�_
		ref = new ActionReference();
		ref.putIndex(charIDToTypeID('Lyr '), i);
		var desc = executeActionGet(ref);
		var layerName = desc.getString(charIDToTypeID('Nm  '));
		//���e�ϼh����ƪ��A
		var layerType = typeIDToStringID(desc.getEnumerationValue(stringIDToTypeID('layerSection')));
		
		//�J��"��Ƨ�����"�N+1
		if(layerType == 'layerSectionEnd') nested ++;
		//�Y�J��"��Ƨ��}�l" �B �b�_�����N-1
		else if(layerType == 'layerSectionStart' && nested > 1) nested--;
		//�Y�J��"��Ƨ��}�l" �B �b�̥~�h �B �W�٫e�󤣬� -
		else if(layerType == 'layerSectionStart' && (nested-1) == 0 && layerName.split(' ')[0] != '-' ) {
			//���ùϼh
			var list4 = new ActionList();
			list4.putReference( ref );
			var desc205 = new ActionDescriptor();
			desc205.putList( charIDToTypeID( "null" ), list4 );			
			executeAction( charIDToTypeID( "Hd  " ), desc205, DialogModes.NO );
			//����Ҧ��ĪG
			rootTemp.unshift(i);
			rootLsets.push(rootTemp);
			rootTemp = [];
			nested = 0;
			
		}
		
		//�e�󰻴�
		if(layerName.split(' ')[0] == '-' ){
			//���ùϼh
			var list4 = new ActionList();
			list4.putReference( ref );
			var desc205 = new ActionDescriptor();
			desc205.putList( charIDToTypeID( "null" ), list4 );			
			executeAction( charIDToTypeID( "Hd  " ), desc205, DialogModes.NO );
		}
		//var isLayerSet = (layerType == 'layerSectionContent') ? false : true;
		//if (isLayerSet)	Lsets.push(i);
	};
	return rootLsets;
};

///////////////////////////////////////////////////////////////////////////////   
// Function: hasLayerMask   
// Usage: see if there is a raster layer mask   
// Input: <none> Must have an open document   
// Return: true if there is a vector mask   
///////////////////////////////////////////////////////////////////////////////   
function hasLayerMask(index) {
	var hasLayerMask = false;
	try {
		var ref = new ActionReference();
		var keyUserMaskEnabled = app.charIDToTypeID('UsrM');
		ref.putIndex(charIDToTypeID('Lyr '), index);
		ref.putProperty(app.charIDToTypeID('Prpr'), keyUserMaskEnabled);
		ref.putEnumerated(app.charIDToTypeID('Lyr '), app.charIDToTypeID('Ordn'), app.charIDToTypeID('Trgt'));
		var desc = executeActionGet(ref);
		if (desc.hasKey(keyUserMaskEnabled)) {
			hasLayerMask = true;
		}
	} catch (e) {
		hasLayerMask = false;
	}
	return hasLayerMask;
}
///////////////////////////////////////////////////////////////////////////////   
// Function: hasVectorMask   
// Usage: see if there is a vector layer mask   
// Input: <none> Must have an open document   
// Return: true if there is a vector mask   
///////////////////////////////////////////////////////////////////////////////   
function hasVectorMask() {   
var hasVectorMask = false;   
try {   
var ref = new ActionReference();   
var keyVectorMaskEnabled = app.stringIDToTypeID( 'vectorMask' );   
var keyKind = app.charIDToTypeID( 'Knd ' );   
ref.putEnumerated( app.charIDToTypeID( 'Path' ), app.charIDToTypeID( 'Ordn' ), keyVectorMaskEnabled );   
var desc = executeActionGet( ref );   
if ( desc.hasKey( keyKind ) ) {   
var kindValue = desc.getEnumerationValue( keyKind );   
if (kindValue == keyVectorMaskEnabled) {   
hasVectorMask = true;   
}   
}   
}catch(e) {   
hasVectorMask = false;   
}   
return hasVectorMask;   
}   

function isGroup(idx) {
	var ref = new ActionReference();
	ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
	var count = executeActionGet(ref).getInteger(charIDToTypeID('NmbL')) + 1;
	var Names = [];
	try {
		activeDocument.backgroundLayer;
		var i = 0;
	} catch (e) {
		var i = 1;
	};
	ref = new ActionReference();
	ref.putIndex(charIDToTypeID('Lyr '), idx);
	var desc = executeActionGet(ref);
	//var layerName = desc.getString(charIDToTypeID('Nm  '));
	//var Id = desc.getInteger(stringIDToTypeID('layerID'));
	//var list = desc.getList( stringIDToTypeID( 'targetLayers'));
	//if (layerName.match(/^<\/Layer group/))
		//continue;
	var layerType = typeIDToStringID(desc.getEnumerationValue(stringIDToTypeID('layerSection')));
	var isLayerSet = (layerType == 'layerSectionContent') ? false : true;
	//Names.push([[Id], [layerName], [isLayerSet], [list]]);
	return isLayerSet;
};

function getLayerLayerSectionByIndex(index) {
	var ref = new ActionReference();
	ref.putProperty(stringIDToTypeID('property'), stringIDToTypeID('layerSection'));
	ref.putIndex(stringIDToTypeID('layer'), index);
	return typeIDToStringID(executeActionGet(ref).getEnumerationValue(stringIDToTypeID('layerSection')));
};
function getLayerNameByIndex(index) {
	var ref = new ActionReference();
	ref.putIndex(charIDToTypeID('Lyr '), index);
	return executeActionGet(ref).getString(charIDToTypeID('Nm  '));
};
function skipNestedSets(layerIndex) {
	var isEnd = false;
	layerIndex = app.activeDocument.layers[app.activeDocument.layers.length - 1].isBackgroundLayer ? layerIndex - 2 : layerIndex;
	while (!isEnd) {
		layerIndex--;
		if (getLayerLayerSectionByIndex(layerIndex) == 'layerSectionStart')
			layerIndex = skipNestedSets(layerIndex);
		isEnd = getLayerNameByIndex(layerIndex) == '</Layer group>' ? true : false;
	}
	return layerIndex - 1;
};

function getChildIndex(idx, skipNested) {
	var layerSetIndex = idx;
	var isEndOfSet = false;
	var layerIndexArray = [];
	while (!isEndOfSet) {
		layerSetIndex--;
		if (getLayerLayerSectionByIndex(layerSetIndex) == 'layerSectionStart' && skipNested) {
			layerSetIndex = skipNestedSets(layerSetIndex);
		}
		if (getLayerLayerSectionByIndex(layerSetIndex) == undefined)
			break;
		isEndOfSet = getLayerNameByIndex(layerSetIndex) == '</Layer group>' ? true : false;
		if (!isEndOfSet)
			layerIndexArray.push(layerSetIndex);
	}
	
	return layerIndexArray;
};

function cropToSelection() {
	try {
		activeDocument.crop(activeDocument.selection.bounds);
	} catch (e) {}
}
