require('../app/app.js');
const angular = require('angular');
require('angular-mocks');

describe('tests angular client app for people resource', () => {
  var peopleController;

  beforeEach(angular.mock.module('TwoResourceApp'));
  beforeEach(angular.mock.inject(function($controller) {
    peopleController = $controller('PeopleController');
  }));

  it('should construct a controller', () => {
    expect(typeof peopleController).toBe('object');
    expect(typeof peopleController.getPeople).toBe('function');
  });

  describe('testing crud operations', () => {
    var $httpBackend;

    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
    }));
    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get all people', () => {
      $httpBackend.expectGET('http://localhost:3000/api/people')
        .respond(200, {data: [{name: 'bob', favoriteFood: 'pizza', age: 2}]});
      peopleController.getPeople();
      $httpBackend.flush();
      expect(peopleController.people.length).toBe(1);
      expect(peopleController.people[0].name).toBe('bob');
      expect(peopleController.people[0].favoriteFood).toBe('pizza');
      expect(peopleController.people[0].age).toBe(2);
    });

    it('should create a person', () => {
      $httpBackend.expectPOST('http://localhost:3000/api/people', {data: [{name: 'dude', favoriteFood: 'pizza', age: 20}]})
        .respond(200, {data: [{name: 'dude', favoriteFood: 'pizza', age: 20}]});
      peopleController.createPerson({data: [{name: 'dude', favoriteFood: 'pizza', age: 20}]})
      $httpBackend.flush();
      expect(peopleController.people.length).toBe(1);
      expect(peopleController.people[0][0].name).toBe('dude');
      expect(peopleController.people[0][0].favoriteFood).toBe('pizza');
      expect(peopleController.people[0][0].age).toBe(20);
    });

    it('should update a person', () => {
      var updatePerson = {name: 'Homer', favoriteFood: 'donuts', age: 29, _id: 101}
      $httpBackend.expectPUT('http://localhost:3000/api/people/101')
        .respond(200, 'updated');
      peopleController.people.push(updatePerson);
      peopleController.updatePerson(updatePerson);
      $httpBackend.flush();
      expect(updatePerson.editing).toBe(false);
    });

    // it('should delete a person', () => {
    //   $httpBackend.expectDELETE('http://localhost:3000/api/people/5')
    //     .respond(200, 'deleted');
    //   peopleController.people.push({data: [{name: 'flies', _id: 5}]});
    //   peopleController.removePerson({data: {name: 'flies', _id: 5}});
    //   $httpBackend.flush();
    //   expect(peopleController.people.length).toBe(1);
    //   console.log(peopleController.people);
    //   // expect(peopleController.people.every((p) => p._id != 5)).toBe(true);
    // });
  });
});

describe('tests angular client app for animal resource', () => {
  var animalController;

  beforeEach(angular.mock.module('TwoResourceApp'));
  beforeEach(angular.mock.inject(function($controller) {
    animalController = $controller('AnimalController');
  }));

  it('should construct a controller', () => {
    expect(typeof animalController).toBe('object');
    expect(typeof animalController.getAnimal).toBe('function');
  });

  describe('testing crud operations', () => {
    var $httpBackend;

    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
    }));
    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get all animals', () => {
      $httpBackend.expectGET('http://localhost:3000/api/animals')
        .respond(200, {data: [{name: 'kitty', favoriteFood: 'kibble', age: 2}]});
      animalController.getAnimal();
      $httpBackend.flush();
      expect(animalController.animals.length).toBe(1);
      expect(animalController.animals[0].name).toBe('kitty');
      expect(animalController.animals[0].favoriteFood).toBe('kibble');
      expect(animalController.animals[0].age).toBe(2);
    });

    it('should create a animal', () => {
      $httpBackend.expectPOST('http://localhost:3000/api/animals', {data: [{name: 'doggy', favoriteFood: 'dog food', age: 10}]})
        .respond(200, {data: [{name: 'doggy', favoriteFood: 'dog food', age: 10}]});
      animalController.createAnimal({data: [{name: 'doggy', favoriteFood: 'dog food', age: 10}]})
      $httpBackend.flush();
      expect(animalController.animals.length).toBe(1);
      expect(animalController.animals[0][0].name).toBe('doggy');
      expect(animalController.animals[0][0].favoriteFood).toBe('dog food');
      expect(animalController.animals[0][0].age).toBe(10);
    });

    it('should update a animal', () => {
      var updateAnimal = {name: 'Homer', favoriteFood: 'donuts', age: 29, _id: 101}
      $httpBackend.expectPUT('http://localhost:3000/api/animals/101')
        .respond(200, 'updated');
      animalController.animals.push(updateAnimal);
      animalController.updateAnimal(updateAnimal);
      $httpBackend.flush();
      expect(updateAnimal.editing).toBe(false);
    });

    // it('should delete a animal', () => {
    //   $httpBackend.expectDELETE('http://localhost:3000/api/animal/5')
    //   .respond(200, 'deleted');
    //   animalController.animal.push({data: [{name: 'flies', favoriteFood: 'poop', age: 1, _id: 5}]});
    //   animalController.removePerson({data: [{name: 'flies', favoriteFood: 'poop', age: 1, _id: 5}]});
    //   $httpBackend.flush();
    //   expect(animalController.animal.length).toBe(1);
    //   console.log(animalController.animal);
    //   // expect(animalController.people.every((p) => p._id != 5)).toBe(true);
    // });
  });
});
