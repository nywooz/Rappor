import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
    right: 16,
    bottom: 16,
    position: "fixed",
    zIndex: 1
  }
});

const FloatingActionButton = props => {
  const { classes } = props;

  return (
    <Fab
      color="primary"
      aria-label="Add"
      onClick={e => {
        props.onClick && props.onClick(e);
      }}
      className={classes.fab}
    >
      <AddIcon />
    </Fab>
  );
};

FloatingActionButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FloatingActionButton);
