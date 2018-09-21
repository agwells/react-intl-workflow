import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

function makeIntoId(message) {
  return message.toLowerCase();
}

export class T extends React.Component {
  constructor(props) {
    super(props);

    if (React.Children.count(props.children) !== 1) {
      throw new Error("only takes one!");
    }
    const message = React.Children.toArray(props.children)[0];
    if (typeof message === "string") {
      let id = props.id || makeIntoId(message);
      if (props.namespace) {
        id = `${props.namespace}.${id}`;
      }

      this.messageDescription = {
        defaultMessage: message,
        id,
        description: props.description
      };
    } else {
      throw new Error("<T> expects one string child element");
    }
  }

  static propTypes = {
    children: PropTypes.string.isRequired,
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
    description: PropTypes.string,
    namespace: PropTypes.string
  };

  render() {
    return <FormattedMessage {...this.messageDescription} />;
  }
}

/**
 * Create a namespaced version of T, without having to pass the namespace
 * prop over and over.
 *
 * @requires Function.name (must be polyfilled in IE)
 * @export
 * @param {string|React.Component} namespace The component these translations are for. (Its name
 * will be used as the namespace)
 */
export default function nsT(namespace) {
  let nsPrefix;
  if (typeof namespace === "string") {
    nsPrefix = namespace;
  } else {
    nsPrefix = namespace.displayName || namespace.name;
  }

  const fn = function(props) {
    return <T namespace={nsPrefix} {...props} />;
  };
  fn.displayName = `T(${nsPrefix})`;

  return fn;
}

/**
 *
 *
 * @export
 * @param {object} intl The "intl" prop injected by react-intl.injectIntl
 * @todo Export a HOC wrapping IntlProvider and capturing the formatMessage
 * function into a module-scope variable this guy can use automatically?
 * @param {string} message The default message
 * @param {?string} id The id (optional)
 */
export function t(intl, message, id = null, description = null) {
  return intl.formatMessage({
    id: id || message,
    defaultMessage: message,
    description: description || undefined
  });
}
