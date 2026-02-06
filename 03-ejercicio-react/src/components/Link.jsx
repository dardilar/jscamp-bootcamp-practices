import { useRouter } from "../hooks/useRouter";

export function Link({href, children, ...restProps}) {
    const {navigateTo} = useRouter();
    const handleClick = function (e) {
        e.preventDefault();

        navigateTo(href);
    }

    return (
        <a href={href} {...restProps} onClick={handleClick}>{children}</a>
    )
}