const published = '!(_id in path("drafts.**")) && !(_id in path("versions.**"))';
const kinds = '_type in ["event","session","release","archiveEntry"]';
const projection = '{...,"slug":slug.current,"artists":artists[]->{_id,name,"slug":slug.current,biography},"media":media[]{alt,decorative,"url":asset->url,"width":asset->metadata.dimensions.width,"height":asset->metadata.dimensions.height},"relatedIds":related[]->_id}';
export const listQuery = '*[' + published + ' && ' + kinds + ']' + projection;
export const detailQuery = '*[' + published + ' && _type==$kind && slug.current==$slug][0]' + projection;
export const relatedQuery = '*[' + published + ' && ' + kinds + ' && (_id==$id || references($id) || _id in *[_id==$id][0].related[]._ref || count(artists[@._ref in *[_id==$id][0].artists[]._ref])>0 || count(artists[@._ref in *[_id==$id][0].related[]._ref])>0 || count(related[@._ref in *[_id==$id][0].artists[]._ref])>0)]' + projection;
export const settingsQuery = '*[' + published + ' && _type=="siteSettings" && _id=="siteSettings"][0]';
