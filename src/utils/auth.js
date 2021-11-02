class Auth {
    constructor(options) {
        this._address = options.address;
        this._headers = options.headers;
        this._credentials = options.credentials; 
    }

    _checkResponse(res) {
      if (res.ok) {
        return res.json();
      }
      return res.json().then(res => Promise.reject(res)); 
    }

      register(email, password, name) {
        return fetch(`${this._address}/signup`, {
          method: 'POST',
          headers: this._headers,
          credentials: this._credentials,
          body: JSON.stringify({ email, password, name })
        })
        .then((res) => this._checkResponse(res))
      };

      login(email, password) {
        return fetch(`${this._address}/signin`, {
          method: 'POST',
          headers: this._headers,
          credentials: this._credentials,
          body: JSON.stringify({ email, password }),
        })
        .then((res) => this._checkResponse(res))
      };
      
      logout() {
        return fetch(`${this._address}/signout`, {
          method: 'DELETE',
          credentials: this._credentials,
        })
        .then((res) => this._checkResponse(res))
      };

     getContent(token) {
        return fetch(`${this._address}/users/me`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        })
        .then((res) => this._checkResponse(res))
      }
      
}

const auth = new Auth({
    address: 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json'
      },
    credentials: 'include'
});

export default auth;

// // 'https://ya-diploma-backend.nomoredomains.club'
// // 'http://localhost:3000'