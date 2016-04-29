describe('testing app e2e for people resource', function() {
  var name = element(by.model('peoplectrl.newPerson.name'));
  var favFood = element(by.model('peoplectrl.newPerson.favoriteFood'));
  var age = element(by.model('peoplectrl.newPerson.age'));
  var saveButton = element(by.buttonText('New Person'));

  beforeEach(function() {
    browser.get('http://127.0.0.1:8080/')
  })

  it('should add a person', function() {
    name.sendKeys('dude');
    favFood.sendKeys('burgers');
    age.sendKeys(21);
    saveButton.click();
    expect(name.getAttribute('value')).toEqual('dude');
    expect(favFood.getAttribute('value')).toEqual('burgers');
    expect(age.getAttribute('value')).toEqual('21');
  })
  //edit button not found, but works in actual browser =(
  it('should update a person', function() {
    name.sendKeys('dude');
    favFood.sendKeys('burgers');
    age.sendKeys(21);
    saveButton.click();
    element(by.buttonText('Edit')).click();
    element(by.model('person.name')).sendKeys('updateName');
    element(by.buttonText('Save Changes')).click();
    expect(element(by.id('person-name')).getAttribute('value')).toEqual('updateName');
  });
})

describe('testing e2e for animals resource', function() {
  var name = element(by.model('animalctrl.newAnimal.name'));
  var favFood = element(by.model('animalctrl.newAnimal.favoriteFood'));
  var age = element(by.model('animalctrl.newAnimal.age'));
  var saveButton = element(by.buttonText('New Animal'));

  beforeEach(function() {
    browser.get('http://127.0.0.1:8080/')
  });

  it('should add an animal', function() {
    name.sendKeys('puppy');
    favFood.sendKeys('meat');
    age.sendKeys(1);
    saveButton.click();
    expect(name.getAttribute('value')).toEqual('puppy');
    expect(favFood.getAttribute('value')).toEqual('meat');
    expect(age.getAttribute('value')).toEqual('1');
  });

})
