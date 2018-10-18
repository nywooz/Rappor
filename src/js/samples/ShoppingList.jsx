import React from "react";
import ReactDOM from "react-dom";

// React class and state
export default class ShoppingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buyItems: ["milk", "fruit"],
      message: ""
    };
    this.noItemMessage = "No items on your list, add some.";
  }

  addItem(e) {
    e.preventDefault();
    const { buyItems } = this.state;
    const newItem = this.newItem.value;
    const isOnTheList = buyItems.includes(newItem);

    if (isOnTheList) {
      this.setState({
        message: "This item is already on the list"
      });
    } else {
      newItem !== "" &&
        this.setState({
          buyItems: [...this.state.buyItems, newItem],
          message: ""
        });
    }
    this.addForm.reset();
  }

  removeItem(item) {
    event.preventDefault();
    // old items - "this.state.buyItems"
    // new items - "newBuyItems"
    // get old state, filter it
    const newBuyItems = this.state.buyItems.filter(buyItem => {
      return buyItem !== item;
    });

    this.setState({
      buyItems: [...newBuyItems]
    });

    if (newBuyItems.length === 0) {
      this.setState({
        message: this.noItemMessage
      });
    }
  }

  clearAll(buyItems) {
    this.setState({
      buyItems: [],
      message: this.noItemMessage
    });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { buyItems, message } = this.state;
    return (
      <div>
        <h2>Shopping List</h2>

        <form
          ref={input => (this.addForm = input)}
          className="form-inline"
          onSubmit={e => {
            this.addItem(e);
          }}
        >
          <div>
            <label className="sr-only" htmlFor="newItemInput">
              Add New Item
            </label>
            <input
              ref={input => (this.newItem = input)}
              type="text"
              placeholder="Bread"
              className="form-control"
              id="newItemInput"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
        {(message !== "" || buyItems.length === 0) && (
          <p className="message text-danger">{message}</p>
        )}
        {buyItems.length > 0 && (
          <table className="table table-striped">
            <thead className="thead-inverse thead-dark">
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {buyItems.map((item, index) => {
                return (
                  <tr key={item}>
                    <th scope="row">{index + 1}</th>
                    <td>{item}</td>
                    <td>
                      <button
                        type="submit"
                        className="btn btn-sm btn-secondary"
                        onClick={e => {
                          this.removeItem(item);
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td />
                <td className="text-right">
                  <button
                    className="btn btn-default btn-sm"
                    onClick={e => {
                      this.clearAll(buyItems);
                    }}
                  >
                    Clear List
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    );
  }
}
