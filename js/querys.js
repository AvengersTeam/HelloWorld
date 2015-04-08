function clearAllTables() {
  var allTablesID = ['#subject-table','#predicate-table','#object-table'];
  for ( key in allTablesID ) {
    $( allTablesID[key] ).empty();
  }
}

function doSubjectQuery() { 
  var value = $('#subject').val();
  var q = 'SELECT DISTINCT ?Subject ?Predicate ?Object WHERE { ?Subject ?Predicate ?Object . FILTER regex(str(?Subject), "'+ value +'", "i" ) } LIMIT 10';
  doQuery(q,'#subject')
}

function doPredicateQuery() { 
  var value = $('#predicate').val();
  var q = 'SELECT DISTINCT ?Subject ?Predicate ?Object WHERE { ?Subject ?Predicate ?Object . FILTER regex(str(?Predicate), "'+ value +'", "i" ) } LIMIT 10';
  doQuery(q,'#predicate')
}

function doObjectQuery() { 
  var value = $('#object').val();
  var q = 'SELECT DISTINCT ?Subject ?Predicate ?Object WHERE { ?Subject ?Predicate ?Object . FILTER regex(?Object, "'+ value +'", "i" ) } LIMIT 10';
  doQuery(q,'#object')
}

function doQuery(q,resContainerId) {
  var prefixs = {
    cd: 'PREFIX cd: <http://www.recshop.fake/cd#>',
    rdf: 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
    dbpediaowl: 'PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>',
    dbpediares: 'PREFIX dbpedia-res: <http://dbpedia.org/resource/>',
  };

  var prefix = prefixs.cd + prefixs.rdf + prefixs.dbpediaowl + prefixs.dbpediares;
  //var url = 'http://localhost:8080/openrdf-sesame/repositories/test';
  var url = 'http://dbpedia.org/sparql';

  $( resContainerId + '-table' ).empty();
  $( resContainerId + 'Btn' ).removeClass( 'glyphicon-search' ).addClass( 'glyphicon-refresh glyphicon-refresh-animate' );
  $( resContainerId + '-disable' ).attr( 'disabled', '' );

  $.ajax({
    dataType: 'jsonp',
    data: {
      //queryLn: 'SPARQL',
      query: prefix  + q,
      format: 'application/sparql-results+json',
      //infer: 'true',
      //Accept: 'application/sparql-results+json' // Si pongo format en vez de Accept se enoja
    },
    url: url,
    success: function( data ) {
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
          table += '<td><a href="' + v[it].value + '">' + v[it].value + '</a></td>'; 
        } );
        table += '</tr>';  
      });
      if( data.results.bindings.length == 0 ) { console.log('missing?'); table += '<tr><td colspan="'+props.length+'" class="text-center">Sin Resultados</td></tr>';}
      $( resContainerId + '-table' ).empty().append( table );
      $( resContainerId + 'Btn' ).removeClass( 'glyphicon-refresh glyphicon-refresh-animate' ).addClass( 'glyphicon-search' );
      $( resContainerId + '-disable' ).removeAttr( 'disabled' );
    }
  });
}