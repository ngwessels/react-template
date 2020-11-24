export const getServerSideProps = async ({ res }) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/xml;charset=utf-8');

    let string = '';
    for (let x = 0; x < 900000; x++) {
        string += `<url><loc>https://localhoney-test.web.app/</loc></url>`;
    }
    const sitemap = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${string}
    </urlset> 
    `;

    res.write(sitemap);
    res.end();
};

// a component is needed
export default () => null; 