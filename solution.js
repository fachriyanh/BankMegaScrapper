var fs = require("fs");
const rp = require('request-promise');
const $ = require('cheerio');
const scrapurl = 'https://www.bankmega.com/promolainnya.php?';
const {URL} = require('url');

global.category;
global.page;
global.nCategories;

global.data = {};
global.pages = [];
global.promo =[];

async function main(){
    let categories = [];
    await countCategories();
    for(let i=1; i <= nCategories; i++){
        await getCategories(i);
        await getPages(i);
        await categories.push(getPromos(i,category));
    }
    Promise.all(categories).then(function(){
        const filename = 'solution.json';
        fs.writeFileSync(filename, JSON.stringify(data, null, 4));

    });
}

async function getPromos(i,category){
    for(let j=1; j<=pages[i-1]; j++){   
        getPromo(i,j)
    }
}

async function getPromo(i,j){
    await rp(scrapurl+"&subcat="+i+"&page="+j)
        .then(async function(response){
            for(let k = 0; k<nCategories; k++){
                try {
                    var detailLink = new URL($('#promolain li a', response).attr('href'), scrapurl).toString();
                    getPromoDetail(detailLink);
                } catch(err) {
                    
            }
        }
    });
    data[category] = promo;
}

async function getPromoDetail(detailLink) {
    await rp(detailLink).then(async function(response){  
        detail= {
                    title:  $('.titleinside  h3', response).text(),
                    link : detailLink,
                    area:  $('.area  b', response).text(),
                    periode:  $('.periode  b',response).text(),
                    image: new URL($('.keteranganinside img', response).attr('src'), scrapurl).toString()
                }
            console.clear();
            console.log('=== Fachriyan Husaini ===');
            console.log('Processing : '+detail.title);
            promo.push(detail);
        });
}

async function getPages(i){
    return rp(scrapurl+"&subcat="+i)
        .then(async function(response){
            page = $('.tablepaging tbody tr td a', response)[1].attribs.title;
            pages.push(parseInt(page.replace('Page 1 of ','')));
    });
}

async function getCategories(i){
    return rp(scrapurl+"&subcat="+i)
        .then(async function(response){
        category = $('#subcatselected  img', response)[0].attribs.title;
    });
}

async function countCategories(){
    return rp(scrapurl)
        .then(async function(response){
            nCategories = $('#subcatpromo div', response).length;
        });
}

main();