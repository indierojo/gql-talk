import Relay from 'react-relay'

export default class HomeRoute extends Relay.Route {
}
HomeRoute.routeName = 'AppHomeRoute'
HomeRoute.queries = {
  viewer: () => Relay.QL`
    query {
      viewer
    }
  `
}
