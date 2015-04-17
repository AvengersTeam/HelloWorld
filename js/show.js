

// show() consulta por el objeto según 'nombre' y despliega sus datos asociados
$(document).ready(function show() {
	var nombre = 'http://www.semanticweb.org/sisib/ontologies/2015/3/ubibtest#' + getQueryVariable('nombre');
	$( '#resource' ).text( getQueryVariable('nombre') );
	var query = 'SELECT ?Property ?Value WHERE{ ?url ?Property ?Value FILTER( str(?url) = "' + nombre + '" ) }';
	doQuery(query, "#predicate");
	console.log(query);
	console.log("relacionados!");

});

// getQueryVariable obtiene el valor enviado por get asociado a la 'variable'
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {    
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  alert('Error en get, variable ' + variable + ' no encontrada en la url.');
}

function doQuery(q,resContainerId) {
var prefixs = {
    cd: 'PREFIX cd: <http://www.recshop.fake/cd#>',
    rdf: 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
    dbpediaowl: 'PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>',
    dbpediares: 'PREFIX dbpedia-res: <http://dbpedia.org/resource/>',
    foaf: 'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
    ubitest: 'PREFIX ubitest: <http://www.semanticweb.org/sisib/ontologies/2015/3/ubibtest#>',
    bio: 'PREFIX bio: <http://vocab.org/bio/0.1/>'
  };
  var url = 'http://localhost:8080/openrdf-sesame/repositories/autoridades';
  var prefix = prefixs.cd + prefixs.rdf + prefixs.dbpediaowl + prefixs.dbpediares + prefixs.foaf + prefixs.ubitest + prefixs.bio;
  
    $.ajax({
		dataType: 'jsonp',
		data: {
		  query: prefix  + q,
		  Accept: 'application/sparql-results+json' 
		},
		url: url,
		success: function( data ) {
		  var table = '<table class="table table-condensed table-bordered"><thead><tr>';
		  var props = [];
		  $( data.head.vars ).each( function( k, v ) {
			props.push( v );
			table += '<th>' + v + '</th>';
			console.log( v);
		  });
		  table += '</tr></thead><tbody>';
		  $( data.results.bindings ).each( function( k, v ) {
			table += '<tr>';
			$( props ).each( function ( i, it ) { 
			  if (v[it].value.substr(0,7)=='http://') table += '<td><a href="' + fixUrl(v[it].value) + '" target="_blank">' + v[it].value + '</a></td>';
			  else table += '<td>' + v[it].value + '</td>';
			  console.log( v[it].value);
			} );
			table += '</tr>';  
		  });
		  if( data.results.bindings.length == 0 ) { console.log('missing?'); table += '<tr><td colspan="'+props.length+'" class="text-center">Sin Resultados</td></tr>';}

		  $( resContainerId + '-table' ).append( table );
		  console.log(table);
		}
    });
	
	function fixUrl(original_url) {
		var location = "file:///C:/Users/SISIB/HelloWorld/show.html?nombre=";
		if (original_url.split("#")[0] != "http://www.semanticweb.org/sisib/ontologies/2015/3/ubibtest") return original_url
		var original_val = original_url.split("#")[1];
		return location + original_val;
	}
}

/*
function doQuery(q,resContainerId) {
  var prefixs = {
    cd: 'PREFIX cd: <http://www.recshop.fake/cd#>',
    rdf: 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
    dbpediaowl: 'PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>',
    dbpediares: 'PREFIX dbpedia-res: <http://dbpedia.org/resource/>',
    foaf: 'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
    ubitest: 'PREFIX ubitest: <http://www.semanticweb.org/sisib/ontologies/2015/3/ubibtest#>',
    bio: 'PREFIX bio: <http://vocab.org/bio/0.1/>'
  };

  var prefix = prefixs.cd + prefixs.rdf + prefixs.dbpediaowl + prefixs.dbpediares + prefixs.foaf + prefixs.ubitest + prefixs.bio;
  var url = 'http://localhost:8080/openrdf-sesame/repositories/autoridades';
  //var url = 'http://dbpedia.org/sparql';

  $( resContainerId + '-table' ).empty();
  $( resContainerId + 'Btn' ).removeClass( 'glyphicon-search' ).addClass( 'glyphicon-refresh glyphicon-refresh-animate' );
  $( resContainerId + '-disable' ).attr( 'disabled', '' );

  $.ajax({
    dataType: 'jsonp',
    data: {
      //queryLn: 'SPARQL',
      query: prefix  + q,
      //format: 'application/sparql-results+json',
      //infer: 'true',
      Accept: 'application/sparql-results+json' // Si pongo format en vez de Accept se enoja
    },
    url: url,
    success: function( data ) {
      console.log(data)
      var table = '<table class="table table-condensed table-bordered"><thead><tr>';
      var props = [];
      $( data.head.vars ).each( function( k, v ) {
        props.push( v );
        table += '<th>' + v + '</th>';
      });
      table += '</tr></thead><tbody>';
      $( data.results.bindings ).each( function( k, v ) {
        table += '<tr>';
        $( props ).each( function ( i, it ) { 
          table += '<td><a href="' + v[it].value + '" target="_blank">' + v[it].value + '</a></td>'; 
        } );
        table += '</tr>';  
      });
      if( data.results.bindings.length == 0 ) { console.log('missing?'); table += '<tr><td colspan="'+props.length+'" class="text-center">Sin Resultados</td></tr>';}

      var closeBtn = $('<button>').addClass('btn btn-default btn-close').attr('onclick','clearTable("'+ resContainerId +'-table")');
      var span = $('<span>').addClass('glyphicon glyphicon-remove');
      closeBtn.append(span)
      $( resContainerId + '-table' ).empty().append(closeBtn);
      $( resContainerId + '-table' ).append( table );
      $( resContainerId + 'Btn' ).removeClass( 'glyphicon-refresh glyphicon-refresh-animate' ).addClass( 'glyphicon-search' );
      $( resContainerId + '-disable' ).removeAttr( 'disabled' );
    }
  });
}
*/