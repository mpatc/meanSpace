(function () {
  'use strict';

  describe('Publicspaces Route Tests', function () {
    // Initialize global variables
    var $scope,
      PublicspacesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PublicspacesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PublicspacesService = _PublicspacesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('publicspaces');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/publicspaces');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PublicspacesController,
          mockPublicspace;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('publicspaces.view');
          $templateCache.put('modules/publicspaces/client/views/view-publicspace.client.view.html', '');

          // create mock Publicspace
          mockPublicspace = new PublicspacesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Publicspace Name'
          });

          //Initialize Controller
          PublicspacesController = $controller('PublicspacesController as vm', {
            $scope: $scope,
            publicspaceResolve: mockPublicspace
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:publicspaceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.publicspaceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            publicspaceId: 1
          })).toEqual('/publicspaces/1');
        }));

        it('should attach an Publicspace to the controller scope', function () {
          expect($scope.vm.publicspace._id).toBe(mockPublicspace._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/publicspaces/client/views/view-publicspace.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PublicspacesController,
          mockPublicspace;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('publicspaces.create');
          $templateCache.put('modules/publicspaces/client/views/form-publicspace.client.view.html', '');

          // create mock Publicspace
          mockPublicspace = new PublicspacesService();

          //Initialize Controller
          PublicspacesController = $controller('PublicspacesController as vm', {
            $scope: $scope,
            publicspaceResolve: mockPublicspace
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.publicspaceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/publicspaces/create');
        }));

        it('should attach an Publicspace to the controller scope', function () {
          expect($scope.vm.publicspace._id).toBe(mockPublicspace._id);
          expect($scope.vm.publicspace._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/publicspaces/client/views/form-publicspace.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PublicspacesController,
          mockPublicspace;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('publicspaces.edit');
          $templateCache.put('modules/publicspaces/client/views/form-publicspace.client.view.html', '');

          // create mock Publicspace
          mockPublicspace = new PublicspacesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Publicspace Name'
          });

          //Initialize Controller
          PublicspacesController = $controller('PublicspacesController as vm', {
            $scope: $scope,
            publicspaceResolve: mockPublicspace
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:publicspaceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.publicspaceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            publicspaceId: 1
          })).toEqual('/publicspaces/1/edit');
        }));

        it('should attach an Publicspace to the controller scope', function () {
          expect($scope.vm.publicspace._id).toBe(mockPublicspace._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/publicspaces/client/views/form-publicspace.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
