//  https://react-cn.github.io/react/tips/if-else-in-JSX.html

//  method 1 - ternary expression
//  you can use if statements outside of your JSX to determine which components should be used:
class App extends React.Component {
  render() {
    let loginButton;
    if (loggedIn) {
      loginButton = <LogoutButton />;
    } else {
      loginButton = <LoginButton />;
    }

    loginButton === loggedIn ? <LogoutButton /> : <LoginButton />;

    return (
      <nav>
        <Home />
        {loginButton}
      </nav>
    );
  }
}

//  method 2 -  "inline" aesthetic
//  define immediately-invoked function expressions inside your JSX
//  an ES6 arrow function is utilized to lexically bind the value of this.
class App extends React.Component {
  render() {
    return (
      <section>
        <h1>Color</h1>
        <h3>Name</h3>
        <p>{this.state.color || "white"}</p>
        <h3>Hex</h3>
        <p>
          {(() => {
            switch (this.state.color) {
              case "red":
                return "#FF0000";
              case "green":
                return "#00FF00";
              case "blue":
                return "#0000FF";
              default:
                return "#FFFFFF";
            }
          })()}
        </p>
      </section>
    );
  }
}

//  https://blog.logrocket.com/conditional-rendering-in-react-c6b0e5af381e
class App extends React.Component {
  // ...
  render() {
    if (this.state.mode === "view") {
      return (
        <div>
          <p>Text: {this.state.text}</p>
          <button onClick={this.handleEdit}>Edit</button>
        </div>
      );
    } else {
      return (
        <div>
          <p>Text: {this.state.text}</p>
          <input onChange={this.handleChange} value={this.state.inputText} />
          <button onClick={this.handleSave}>Save</button>
        </div>
      );
    }
  }
}

class App extends React.Component {
  // ...
  renderInputField2() {
    let input;

    if (this.state.mode !== "view") {
      input = (
        <p>
          <input onChange={this.handleChange} value={this.state.inputText} />
        </p>
      );
    }

    return input;
  }

  renderButton() {
    let button;
    if (this.state.mode === "view") {
      button = <button onClick={this.handleEdit}>Edit</button>;
    } else {
      button = <button onClick={this.handleSave}>Save</button>;
    }
    return button;
  }

  renderInputField() {
    if (this.state.mode === "view") {
      return <div />;
    } else {
      return (
        <p>
          <input onChange={this.handleChange} value={this.state.inputText} />
        </p>
      );
    }
  }

  renderButton() {
    if (this.state.mode === "view") {
      return <button onClick={this.handleEdit}>Edit</button>;
    } else {
      return <button onClick={this.handleSave}>Save</button>;
    }
  }

  render() {
    return (
      <div>
        <p>Text: {this.state.text}</p>
        {this.renderInputField()}
        {this.renderButton()}
      </div>
    );
  }
}

class Number extends React.Component {
  render() {
    if (this.props.number % 2 == 0) {
      return (
        <div>
          <h1>{this.props.number}</h1>
        </div>
      );
    } else {
      return null;
    }
  }
}

class Number extends React.Component {
  // ...
  render() {
    return (
      <div>
        <p>Text: {this.state.text}</p>

        {view ? null : (
          <p>
            <input onChange={this.handleChange} value={this.state.inputText} />
          </p>
        )}
      </div>
    );
  }
}

// Subcomponents
const SaveComponent = props => {
  return (
    <div>
      <p>
        <input onChange={props.handleChange} value={props.text} />
      </p>
      <button onClick={props.handleSave}>Save</button>
    </div>
  );
};

const EditComponent = props => {
  return <button onClick={props.handleEdit}>Edit</button>;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "", inputText: "", mode: "view" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleChange(e) {
    this.setState({ inputText: e.target.value });
  }

  handleSave() {
    this.setState({ text: this.state.inputText, mode: "view" });
  }

  handleEdit() {
    this.setState({ mode: "edit" });
  }

  render() {
    const view = this.state.mode === "view";

    return (
      <div>
        <p>Text: {this.state.text}</p>

        {view ? (
          <EditComponent handleEdit={this.handleEdit} />
        ) : (
          <SaveComponent
            handleChange={this.handleChange}
            handleSave={this.handleSave}
            text={this.state.inputText}
          />
        )}
      </div>
    );
  }
}
