// Generated by CoffeeScript 1.9.1
(function() {
  var Promise, _, audit;

  _ = require('underscore');

  Promise = require('../promise');

  audit = function(dbNames, couch_utils) {
    var conf;
    conf = couch_utils.conf;
    audit = {};
    audit.getAudit = function(client, startDate, endDate) {
      var auditPromises, opts;
      opts = {
        path: '/audit',
        qs: {}
      };
      if ((startDate != null) && !isNaN(startDate)) {
        opts.qs.startkey = startDate;
      }
      if ((endDate != null) && !isNaN(endDate)) {
        opts.qs.endkey = endDate;
      }
      auditPromises = dbNames.map(function(db) {
        return db.viewWithList('pantheon', 'audit_by_timestamp', 'get_values', 'promise');
      });
      return Promise.all(auditPromises).then(function(resps) {
        var entries;
        entries = _.flatten(resps, true);
        entries = _.sortBy(entries, function(entry) {
          return entry.entry.dt;
        });
        return Promise.resolve(entries);
      });
    };
    audit.handleGetAudit = function(req, resp) {
      var endDate, startDate;
      startDate = parseInt(req.query.start);
      endDate = parseInt(req.query.end);
      return audit.getAudit(req.couch, startDate, endDate).then(function(entries) {
        return resp.send(JSON.stringify(entries));
      }, function(err) {
        return console.error('handle_get_audit', err);
      })(resp.status(500).send(JSON.stringify({
        error: 'internal error',
        msg: 'internal error'
      })));
    };
    return audit;
  };

  module.exports = audit;

}).call(this);