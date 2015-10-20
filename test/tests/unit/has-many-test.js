const computed = Ember.computed;

const HasManyArray = Ember.ArrayProxy.extend({
  store: null,
  type: null,
  id: null,
  field: null,
  content: null,

  init() {
    this._super();
    this.set('content', []);
  },

  arrangedContent: computed('content.@each.eoStatus', function() {
    return this.get('content').filterBy('eoStatus', 'loaded') : [];
  }),

  addObject(record) {
    const relatedId = record.get('id');
    const type = this.get('type');
    const id = this.get('id');
    const field = this.get('field');

    this.get('store').add(type, id, field, relatedId);
  }
});

module("Unit - hasMany", {});

test('when addObject is called', function() {
  const record = Ember.Object.create({id: 1, type: 'planet'});
  const store = {
    add: sinon.spy()
  };
  const array = HasManyArray.create({store});

  array.addObject(record);

  equal(array.get('length'), 0, 'it remains empty');
  ok(store.add.called, 'add is called on the store');
});

test('when array contains one loaded and one pending record', function() {
  const loadedRecord = Ember.Object.create({id: 1, type: 'planet', eoStatus: 'loaded'});
  const pendingRecord = Ember.Object.create({id: 1, type: 'planet', eoStatus: 'pending'});
  const array = HasManyArray.create({content: [loadedRecord, pendingRecord]});

  ok(array.contains(loadedRecord), 'it contains the loaded record');
  ok(!array.contains(pendingRecord), 'it does not contain the pending record');
});

test('when a record is added to the content directly', function() {
  const record = Ember.Object.create({id: 1, type: 'planet'});
  const store = {
    add: sinon.spy()
  };
  const array = HasManyArray.create({store});
  array.get('content').addObject(record);

  ok(!store.add.called, 'the store does not receive a call to add');
});
