import user from './../../src/reducers/user';

describe('Current User', () => {

  let action;
  const sampleUserData = {
    address: {
      address: "2678 NW Stringtown Rd.",
      city: "Forest Grove",
      state: "OR",
      zip: "97116"
    },
    dark: false,
    email: "nwessels16@gmail.com",
    emailNotifications: false,
    emailVerified: true,
    firstName: "Nate",
    lastLogin: 1567286765073,
    lastName: "Wessels",
    light: true,
    phone: "9712174953",
    phoneNotifications: false
  };

  test('Should return default state if no action type is recognized', () => {
    expect(user({}, { type: null })).toEqual('');
  });

  test('Should successfully add user to user Reducer', () => {
    const { address, dark, email, emailNotifications, emailVerified, firstName, lastName, light, phone, phoneNotifications } = sampleUserData;
    action = {
    };
    expect(user({}, action)).toEqual({
      address: address,
      dark: dark,
      email: email,
      emailNotifications: emailNotifications,
      emailVerified: emailVerified,
      firstName: firstName,
      lastName: lastName,
      light: light,
      phone: phone,
      phoneNotifications: phoneNotifications
    });
  });

});
