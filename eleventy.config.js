import * as sass from 'sass';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function(eleventyConfig) {

    // ==========================================
    //  SCSS → CSS (output dans /css/)
    // ==========================================
    eleventyConfig.addTemplateFormats("scss");
    eleventyConfig.addExtension("scss", {
        outputFileExtension: "css",

        compile: async function(inputContent, inputPath) {
            let parsed = path.parse(inputPath);
            if (parsed.name.startsWith("_")) return undefined;

            let result = sass.compile(inputPath, {
                loadPaths: [
                    path.join(__dirname, "src", "css")
                ],
                style: "compressed"
            });

            this.addDependencies(inputPath, result.loadedUrls);
            return async () => result.css;
        }
    });

    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/CNAME");

    // Collection d'articles de blog, triés par date décroissante
    eleventyConfig.addCollection("blog", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
            return b.date - a.date;
        });
    });

    eleventyConfig.addCollection("sitemapPages", function(collectionApi) {
        return collectionApi.getAll().filter((page) => {
            // Only include pages with a URL ending in / or .html
            return page.url && (page.url.endsWith("/") || page.url.endsWith(".html"));
        });
    });

    // Filtre pour formater les dates en français
    eleventyConfig.addFilter("dateFormat", function(date) {
        return new Date(date).toLocaleDateString("fr-CH", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    });

    // Filtre pour la date ISO 8601
    eleventyConfig.addFilter("isoDate", (date) => {
        return new Date(date).toISOString().split('T')[0];
    });


    // Filtre pour l'année courante
    eleventyConfig.addFilter("year", function() {
        return new Date().getFullYear();
    });

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            data: "_data"
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk"
    };
}

