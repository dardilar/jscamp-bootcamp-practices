import { Link as NavLink } from "react-router";

export function Link({href, children, ...restProps}) {
    return (
        <NavLink to={href} {...restProps}>{children}</NavLink>
    )
}