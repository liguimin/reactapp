import React from 'react';
import {Route,BrowserRouter,Switch} from 'react-router-dom';
import { createStore } from 'redux';
import {Provider} from 'react-redux';
import Loadable from 'react-loadable';

//import Login from './component/login/Login';
//import Admin from './component/admin/Admin';
import Page_404 from './component/error/Page_404';
import Page_500 from './component/error/Page_404';
import appReducer from './redux/reducer/reducers';
import Loading from './component/loading/Loading';

const store = createStore(appReducer);

const Login = Loadable({
        loader: () => import('./component/login/Login'),
    loading: Loading,
    });

const Admin = Loadable({
        loader: () => import('./component/admin/Admin'),
    loading: Loading,
    });

class App extends React.Component {
    constructor() {
        super();
    };

    render() {
        return (
            <Provider store={store}>

                <BrowserRouter>
                    <Switch>
                        <Route path="/" component={Admin} exact />
                        <Route path="/login" component={Login}/>
                        <Route path="/admin" component={Admin}/>
                        <Route path="/500" component={Page_500}/>
                        <Route  component={Page_404}/>
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;