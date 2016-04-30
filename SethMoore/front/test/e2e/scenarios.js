'use strict';

describe('our first angular test homepage', function() {
  beforeEach(function() {
    browser.get('http://localhost:9000/');
  });

  it('should have the correct title', function() {
    expect(browser.getTitle()).toEqual('Two Resource API');
  });

  it('should add a new team, "Test Team"', function() {
    element(by.model('api.newTeam.name')).sendKeys('Test Team');

    element(by.css('#add-team button')).click();

    let testTeam = element.all(by.repeater('team in api.teams')).last().element(by.css('h2'));

    expect(testTeam.getText()).toEqual('Test Team');
  });

  it('should add a player to "Test Team"', function() {
    element(by.model('api.newPlayer.name')).sendKeys('Test Player');
    element(by.model('api.newPlayer.alias')).sendKeys('test_player');
    element(by.model('api.newPlayer.position')).sendKeys(1);
    element(by.model('api.newPlayer.current_team')).sendKeys('Test Team');

    element(by.css('#add-player button')).click();

    let testPlayer = element.all(by.repeater('team in api.teams')).last().element(by.css('.player'));
    expect(testPlayer.getText()).toEqual('Position 1: test_player');
  });

  it('should delete the Test Team', function() {
    element(by.css('#Test_Team button.delete-team')).click();

    let lastTeam = element.all(by.repeater('team in api.teams')).last().element(by.css('h2'));

    expect(lastTeam.getText()).not.toEqual('Test Team');
  });

  it('should edit Test Player and change alias and position', function() {
    element(by.css('#test_player button.edit-player')).click();
    element(by.id('test_player')).element(by.model('player.edited.newAlias')).sendKeys('updated_player');
    element(by.id('test_player')).element(by.model('player.edited.newPosition')).sendKeys(5);
    element(by.id('test_player')).element(by.css('button.update-player')).click();
    let updatedPlayer = element(by.css('#updated_player .player'));
    expect(updatedPlayer.getText()).toEqual('Position 5: updated_player');
  });

  it('should edit Test Player and delete it', function() {
    element(by.css('#updated_player button.edit-player')).click();
    element(by.css('#updated_player button.delete-player')).click();
    let EC = protractor.ExpectedConditions;
    EC.not(EC.presenceOf($('#updated_player')));
  });

});
