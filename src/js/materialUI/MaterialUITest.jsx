import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

function ContainedButtons(props) {
  const { classes } = props;
  return (
    <div>
      <div>
        <Button variant="contained" className={classes.button}>
          Default
        </Button>
        <Button variant="contained" color="primary" className={classes.button}>
          Primary
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
        >
          Secondary
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled
          className={classes.button}
        >
          Disabled
        </Button>
        <Button
          variant="contained"
          href="#contained-buttons"
          className={classes.button}
        >
          Link
        </Button>
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file"
          multiple
          type="file"
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            component="span"
            className={classes.button}
          >
            Upload
          </Button>
        </label>
      </div>

      <div>
        <Button className={classes.button}>Default</Button>
        <Button color="primary" className={classes.button}>
          Primary
        </Button>
        <Button color="secondary" className={classes.button}>
          Secondary
        </Button>
        <Button disabled className={classes.button}>
          Disabled
        </Button>
        <Button href="#text-buttons" className={classes.button}>
          Link
        </Button>
        <input
          accept="image/*"
          className={classes.input}
          id="text-button-file"
          multiple
          type="file"
        />
        <label htmlFor="text-button-file">
          <Button component="span" className={classes.button}>
            Upload
          </Button>
        </label>
      </div>

      <div>
      <Button variant="outlined" className={classes.button}>
        Default
      </Button>
      <Button variant="outlined" color="primary" className={classes.button}>
        Primary
      </Button>
      <Button variant="outlined" color="secondary" className={classes.button}>
        Secondary
      </Button>
      <Button variant="outlined" disabled className={classes.button}>
        Disabled
      </Button>
      <Button variant="outlined" href="#outlined-buttons" className={classes.button}>
        Link
      </Button>
      <input
        accept="image/*"
        className={classes.input}
        id="outlined-button-file"
        multiple
        type="file"
      />
      <label htmlFor="outlined-button-file">
        <Button variant="outlined" component="span" className={classes.button}>
          Upload
        </Button>
      </label>
    </div>
    </div>
  );
}

ContainedButtons.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContainedButtons);
