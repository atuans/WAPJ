const express = require('express');

const {registerUser, loginUser, logoutUser, ForgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser} = require('../controller/userController')
const { isAuthenticatedUser, authorizeRoles} = require('../middleware/auth')
const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').get(logoutUser);

router.route('/password/forgot').post(ForgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/me').get(isAuthenticatedUser,getUserDetails);

router.route('/password/update').put(isAuthenticatedUser, updatePassword);

router.route('/me/update').put(isAuthenticatedUser,updateProfile);

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'),getAllUser);

router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles('admin'),getSingleUser)
                                .put(isAuthenticatedUser, authorizeRoles('admin'), updateUserRole)
                                .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);


module.exports = router;
