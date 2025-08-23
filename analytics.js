// Google Analytics externo
(function(){
  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-G9L7PP048X";
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", "G-G9L7PP048X");
})();
