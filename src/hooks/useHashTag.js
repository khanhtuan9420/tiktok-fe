import classNames from "classnames/bind";
import DOMPurify from "dompurify";

const useHashTag = ({ data = '', classes = false, truncate = false }) => {
    const cleanData = DOMPurify.sanitize(data)
    const hashtagRegex = /(?:#)(\p{L}+)/gu; // regular expression để tìm các hashtag trong caption
    return <p className={classNames('hashtag', {
        classes: classes,
        truncate: truncate,
    })} dangerouslySetInnerHTML={{ __html: cleanData.replace(hashtagRegex, '<strong>$&</strong>') }} />
}

export default useHashTag