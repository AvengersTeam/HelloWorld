$('#sparql').val('SELECT ?Nombre ?FechaNacimiento\nWHERE {\n    ?NombreUri foaf:firstName ?Nombre .\n    ?NombreUri bio:event ?b .\n    ?b bio:birth ?FechaNacimiento\n    FILTER (?FechaNacimiento = "1952"^^xsd:string )\n}')
//SELECT ?a ?b ?c WHERE { ?a ?b ?c FILTER (str(?a) = "http://www.semanticweb.org/sisib/ontologies/2015/3/ubibtest#Ahmad_'Abd_al-Majid" ) }

function clearAllTables() {
  var allTablesID = ['#subject-table', '#predicate-table', '#object-table', '#sparql-table'];
  var allInputsID = ['#subject', '#predicate', '#object'];
  for ( key in allTablesID ) {
    $( allTablesID[key] ).empty();
    $( allInputsID[key] ).val('');
  }
}

function clearTable(ID) {
  $( ID ).empty();
}

function doSubjectQuery() { 
  var value = $('#subject').val();
  var q = 'SELECT DISTINCT ?Subject ?Predicate ?Object WHERE { ?Subject ?Predicate ?Object . FILTER regex(str(?Subject), "'+ value +'", "i" ) } LIMIT 10';
  doQuery(q,'#subject');
}

function doPredicateQuery() { 
  var value = $('#predicate').val();
  var q = 'SELECT DISTINCT ?Subject ?Predicate ?Object WHERE { ?Subject ?Predicate ?Object . FILTER regex(str(?Predicate), "'+ value +'", "i" ) } LIMIT 10';
  doQuery(q,'#predicate');
}

function doObjectQuery() { 
  var value = $('#object').val();
  var q = 'SELECT DISTINCT ?Subject ?Predicate ?Object WHERE { ?Subject ?Predicate ?Object . FILTER regex(?Object, "'+ value +'", "i" ) } LIMIT 10';
  doQuery(q,'#object')
}

function doSparql() { 
  var value = $('#sparql').val();
  var q = value;
  doQuery(q,'#sparql');
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
          if (v[it].value.substr(0,7)=='http://') table += '<td><a href="' + v[it].value + '" target="_blank">' + v[it].value + '</a></td>';
          else table += '<td>' + v[it].value + '</td>';
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