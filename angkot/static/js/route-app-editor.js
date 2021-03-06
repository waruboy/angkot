(function(app) {

app.controller('EditorController', ['$scope', '$http', function($scope, $http) {

  $scope.checked = false;
  $scope.valid = false;
  $scope.incomplete = false;
  $scope.saved = false;
  $scope.modified = false;

  $scope.city = '';
  $scope.company = '';
  $scope.number = '';
  $scope.origin = '';
  $scope.destination = '';

  $scope.init = function() {
  }

  $scope.$watch('panel', function(value, old) {
    if (old == 'editor' && value != 'editor') {
      $scope.stashData();
    }
    $scope.setMapEditable(true);
    if (value != 'editor' || value === old) return;
    $scope.unstashData();
  });

  $scope.saveRouteCheck = function() {
    $scope.error = null;
    $scope.message = null;
    $scope.errorIncomplete = false;

    var valid = true;

    var focus = function(name) {
      jQuery('#new-route input[name="'+name+'"]').focus();
    }

    if (!$scope.city) {
      focus('city');
      valid = false;
    }

    if (valid && !$scope.number) {
      focus('number');
      valid = false;
    }

    if (valid && !$scope.licenseAgreement) {
      focus('license-agreement');
      valid = false;
    }

    $scope.incomplete = !valid;
    $scope.checked = true;

    if (valid) {
      $scope.saveRoute();
    }
  }

  $scope.saveRoute = function() {
    $scope.error = null;
    $scope.message = 'mengirim data..';

    var geojson = {
      type: 'Feature',
      properties: {
        city: $scope.city,
        company: $scope.company,
        number: $scope.number,
        origin: $scope.origin,
        destination: $scope.destination,
        license: {
          'ODbL v1.0': $scope.licenseAgreement
        }
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: $scope.map.routes,
      },
    }

    var url = $('body').data('url-save');

    var data = {geojson: JSON.stringify(geojson)};
    if ($scope.parentId) data['parent_id'] = $scope.parentId

    $http.post(url, jQuery.param(data))
      .success(function(data) {
        $scope.message = 'Terima kasih atas partisipasi Anda!';
        $scope.parentId = data.submission_id;
        $scope.checked = false;
        $scope.saved = true;
      })
      .error(function(msg, status) {
        $scope.message = null;
        $scope.error = 'Gagal! code='+status;
      });
  }

  $scope.showLicense = function() {
    $scope.showModalFrom('#license-info-content');
  }

  $scope.$on('map-reset', function() {
    $scope.city = '';
    $scope.company = '';
    $scope.number = '';
    $scope.origin = '';
    $scope.destination = '';
    $scope.licenseAgreement = false;
    $scope.modified = false;
    $scope.saved = false;
    $scope.checked = false;
    $scope.message = null;
    $scope.error = null
  });

  function updateModified() {
    $scope.modified = $scope.city !== '' ||
                      $scope.company !== '' ||
                      $scope.number !== '' ||
                      $scope.origin !== '' ||
                      $scope.destination !== '' ||
                      $scope.map.routes.length > 0;
  }

  $scope.$watch('city', updateModified);
  $scope.$watch('company', updateModified);
  $scope.$watch('number', updateModified);
  $scope.$watch('origin', updateModified);
  $scope.$watch('destination', updateModified);
  $scope.$watch('licenseAgreement', updateModified);
  $scope.$watch('map.routes', updateModified, true);

  // save/restore data

  $scope.stashData = function() {
    var routes = [];
    for (var i=0; i<$scope.map.routes.length; i++) {
      routes.push($scope.map.routes[i].slice());
    }
    var map = {
      center: $scope.map.center,
      zoom: $scope.map.zoom,
      routes: routes,
    }

    $scope.stash = {
      city: $scope.city,
      company: $scope.company,
      number: $scope.number,
      origin: $scope.origin,
      destination: $scope.destination,
      licenseAgreement: $scope.licenseAgreement,
      map: map,
    }
  }

  $scope.unstashData = function() {
    var stash = $scope.stash;
    if (!stash) return;

    $scope.city = stash.city;
    $scope.company = stash.company;
    $scope.number = stash.number;
    $scope.origin = stash.origin;
    $scope.destination = stash.destination;
    $scope.licenseAgreement = stash.licenseAgreement;
    $scope.setMapData(stash.map);
  }

}]);

})(window.angkot.app);

