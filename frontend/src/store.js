import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userDeleteReducer, userDetailsReducer, userListReducer,
    userLoginReducer, userRegisterReducer, userResetPasswordReducer, userUpdateProfileReducer, userUpdateReducer}
    from './apiRequest/reducers/userReducers'
import  {listingListReducer, listingDetailsReducer, 
    listingDeleteReducer, listingCreateReducer, listingUpdateReducer }
    from './apiRequest/reducers/listingReducers'

    
const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,    
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    userResetPassword: userResetPasswordReducer,

    listingList: listingListReducer,
    listingDetails: listingDetailsReducer,
    listingDelete: listingDeleteReducer,
    listingCreate: listingCreateReducer,
    listingUpdate: listingUpdateReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo')?
JSON.parse(localStorage.getItem('userInfo')): null


const initialState = {
    userLogin:{userInfo:  userInfoFromStorage},

}

const middleware = [thunk]

const store = createStore(reducer, initialState,
    composeWithDevTools(applyMiddleware(...middleware)))

export default store