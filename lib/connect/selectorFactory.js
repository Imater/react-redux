'use strict';

exports.__esModule = true;
exports.impureFinalPropsSelectorFactory = impureFinalPropsSelectorFactory;
exports.pureFinalPropsSelectorFactory = pureFinalPropsSelectorFactory;
exports.default = finalPropsSelectorFactory;

var _shallowEqual = require('../utils/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _verifySubselectors = require('./verifySubselectors');

var _verifySubselectors2 = _interopRequireDefault(_verifySubselectors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isConsolePresented = function isConsolePresented() {
  return typeof console !== 'undefined';
};
var isProduction = function isProduction() {
  return process.env.NODE_ENV === 'production';
};
var not = function not(c) {
  return !c;
};
var isReduxForm = function isReduxForm(wrappedComponentName) {
  return (/Form|ConnectedFields/.test(wrappedComponentName)
  );
};

function _objectWithoutProperties(obj, keys) {
  var target = {};for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
  }return target;
}

function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch) {
  return function impureFinalPropsSelector(state, ownProps) {
    return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
  };
}

var loggingAvailable = function loggingAvailable(ref) {
  var wrappedComponentName = ref && ref.wrappedComponentName && ref.wrappedComponentName || '';
  return isConsolePresented() && not(isProduction()) && not(isReduxForm(wrappedComponentName));
};

function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, _ref) {
  var areStatesEqual = _ref.areStatesEqual,
      areOwnPropsEqual = _ref.areOwnPropsEqual,
      areStatePropsEqual = _ref.areStatePropsEqual;

  var hasRunAtLeastOnce = false;
  var state = void 0;
  var ownProps = void 0;
  var stateProps = void 0;
  var dispatchProps = void 0;
  var mergedProps = void 0;

  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState;
    ownProps = firstOwnProps;
    stateProps = mapStateToProps(state, ownProps);

    if (loggingAvailable(_ref)) {
      var sameStateProps = mapStateToProps(state, ownProps);

      if (!(0, _shallowEqual2.default)(stateProps, sameStateProps)) {
        console.group(_ref.wrappedComponentName);
        Object.keys(stateProps).forEach(function (key) {
          var first = stateProps[key];
          var second = sameStateProps[key];

          if (first !== second) {
            console.log('Avoidable rerender', key);
          }
        });
        console.groupEnd();
      }
    }

    dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps);

    if (loggingAvailable(_ref)) {
      var sameStateProps = mapStateToProps(state, ownProps);

      if (!(0, _shallowEqual2.default)(stateProps, sameStateProps)) {
        console.group(_ref.wrappedComponentName);
        Object.keys(stateProps).forEach(function (key) {
          var first = stateProps[key];
          var second = sameStateProps[key];

          if (first !== second) {
            console.log('Avoidable rerender', key);
          }
        });
        console.groupEnd();
      }
    }

    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps) {
      stateProps = mapStateToProps(state, ownProps);

      if (loggingAvailable(_ref)) {
        var sameStateProps = mapStateToProps(state, ownProps);

        if (!(0, _shallowEqual2.default)(stateProps, sameStateProps)) {
          console.group(_ref.wrappedComponentName);
          Object.keys(stateProps).forEach(function (key) {
            var first = stateProps[key];
            var second = sameStateProps[key];

            if (first !== second) {
              console.log('Avoidable rerender', key);
            }
          });
          console.groupEnd();
        }
      }
    }

    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewState() {
    var nextStateProps = mapStateToProps(state, ownProps);
    var statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;

    if (loggingAvailable(_ref)) {
      var sameStateProps = mapStateToProps(state, ownProps);

      if (!(0, _shallowEqual2.default)(stateProps, sameStateProps)) {
        console.group(_ref.wrappedComponentName);
        Object.keys(stateProps).forEach(function (key) {
          var first = stateProps[key];
          var second = sameStateProps[key];

          if (first !== second) {
            console.log('Avoidable rerender', key);
          }
        });
        console.groupEnd();
      }
    }

    if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);

    return mergedProps;
  }

  function handleSubsequentCalls(nextState, nextOwnProps) {
    var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
    var stateChanged = !areStatesEqual(nextState, state);
    state = nextState;
    ownProps = nextOwnProps;

    if (propsChanged && stateChanged) return handleNewPropsAndNewState();
    if (propsChanged) return handleNewProps();
    if (stateChanged) return handleNewState();
    return mergedProps;
  }

  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
  };
}

// TODO: Add more comments

// If pure is true, the selector returned by selectorFactory will memoize its results,
// allowing connectAdvanced's shouldComponentUpdate to return false if final
// props have not changed. If false, the selector will always return a new
// object and shouldComponentUpdate will always return true.

function finalPropsSelectorFactory(dispatch, _ref2) {
  var initMapStateToProps = _ref2.initMapStateToProps,
      initMapDispatchToProps = _ref2.initMapDispatchToProps,
      initMergeProps = _ref2.initMergeProps,
      options = _objectWithoutProperties(_ref2, ['initMapStateToProps', 'initMapDispatchToProps', 'initMergeProps']);

  var mapStateToProps = initMapStateToProps(dispatch, options);
  var mapDispatchToProps = initMapDispatchToProps(dispatch, options);
  var mergeProps = initMergeProps(dispatch, options);

  if (process.env.NODE_ENV !== 'production') {
    (0, _verifySubselectors2.default)(mapStateToProps, mapDispatchToProps, mergeProps, options.displayName);
  }

  var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;

  return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
}