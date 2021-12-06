import * as React from "react";

function SvgImage(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      {...props}
    >
      <g clipPath="url(#clip0_3703_21322)">
        <path d="M85 81H95V79V1H1V81H73H85Z" fill="#CCD1DC" />
        <path
          d="M94 72V1H4V60C4 64.7739 5.89642 69.3523 9.27208 72.7279C12.6477 76.1036 17.2261 78 22 78H88C89.5913 78 91.1174 77.3679 92.2426 76.2426C93.3679 75.1174 94 73.5913 94 72Z"
          fill="#DEE1E7"
        />
        <path
          d="M11 17H87C87.7956 17 88.5587 17.3161 89.1213 17.8787C89.6839 18.4413 90 19.2044 90 20V71C90 71.7956 89.6839 72.5587 89.1213 73.1213C88.5587 73.6839 87.7956 74 87 74H62C47.6783 74 33.9432 68.3107 23.8162 58.1838C13.6893 48.0568 8 34.3217 8 20V20C8 19.2044 8.31607 18.4413 8.87868 17.8787C9.44129 17.3161 10.2044 17 11 17V17Z"
          fill="#F3F4F5"
        />
        <path
          d="M67.625 65.3824L63.3823 69.625L68.8836 75.1263L73.1263 70.8836L67.625 65.3824Z"
          fill="#B8C0CE"
        />
        <path
          d="M93 90.76C93.0032 91.2626 92.9116 91.7613 92.73 92.23C92.4854 92.9019 92.0749 93.501 91.5366 93.9717C90.9983 94.4423 90.3497 94.7691 89.6512 94.9218C88.9526 95.0745 88.2268 95.0481 87.5412 94.8449C86.8557 94.6418 86.2326 94.2686 85.73 93.76L68 76L74 70L91.76 87.76C92.554 88.5565 92.9999 89.6353 93 90.76Z"
          fill="#8288A1"
        />
        <path
          d="M93 90.76C93.0032 91.2626 92.9116 91.7613 92.73 92.23C92.2613 92.4116 91.7626 92.5032 91.26 92.5C90.1353 92.4999 89.0565 92.054 88.26 91.26L70.5 73.5L74 70L91.76 87.76C92.554 88.5565 92.9999 89.6353 93 90.76Z"
          fill="#969CB2"
        />
        <path
          d="M48 75C61.8071 75 73 63.8071 73 50C73 36.1929 61.8071 25 48 25C34.1929 25 23 36.1929 23 50C23 63.8071 34.1929 75 48 75Z"
          fill="#7190C4"
        />
        <path
          d="M48 70C59.0457 70 68 61.0457 68 50C68 38.9543 59.0457 30 48 30C36.9543 30 28 38.9543 28 50C28 61.0457 36.9543 70 48 70Z"
          fill="#C3D2E7"
        />
        <path
          d="M48 57C51.866 57 55 53.866 55 50C55 46.134 51.866 43 48 43C44.134 43 41 46.134 41 50C41 53.866 44.134 57 48 57Z"
          fill="#C3D2E7"
        />
        <path d="M95 1H1V13H95V1Z" fill="#90D1D7" />
        <path
          d="M4 1H95V10H13C10.6131 10 8.32387 9.05179 6.63604 7.36396C4.94821 5.67613 4 3.38695 4 1V1Z"
          fill="#ABD9E6"
        />
        <path
          d="M9 9C10.1046 9 11 8.10457 11 7C11 5.89543 10.1046 5 9 5C7.89543 5 7 5.89543 7 7C7 8.10457 7.89543 9 9 9Z"
          fill="#CF4055"
        />
        <path
          d="M19 9C20.1046 9 21 8.10457 21 7C21 5.89543 20.1046 5 19 5C17.8954 5 17 5.89543 17 7C17 8.10457 17.8954 9 19 9Z"
          fill="#F6B756"
        />
        <path
          d="M29 9C30.1046 9 31 8.10457 31 7C31 5.89543 30.1046 5 29 5C27.8954 5 27 5.89543 27 7C27 8.10457 27.8954 9 29 9Z"
          fill="#85BD79"
        />
        <path
          d="M95 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1L0 81C0 81.2652 0.105357 81.5196 0.292893 81.7071C0.48043 81.8946 0.734784 82 1 82H72.59L85.05 94.46C85.5345 94.9557 86.1126 95.3503 86.7507 95.621C87.3887 95.8917 88.0742 96.0331 88.7673 96.037C89.4605 96.041 90.1475 95.9074 90.7886 95.6439C91.4297 95.3805 92.0122 94.9925 92.5024 94.5024C92.9925 94.0122 93.3805 93.4297 93.6439 92.7886C93.9074 92.1475 94.041 91.4605 94.037 90.7673C94.0331 90.0742 93.8917 89.3887 93.621 88.7507C93.3503 88.1126 92.9557 87.5345 92.46 87.05L87.46 82.05H95C95.2652 82.05 95.5196 81.9446 95.7071 81.7571C95.8946 81.5696 96 81.3152 96 81.05V1C96 0.734784 95.8946 0.48043 95.7071 0.292893C95.5196 0.105357 95.2652 0 95 0V0ZM2 2H94V12H2V2ZM92 90.76C91.9968 91.4004 91.8045 92.0257 91.4472 92.5572C91.0898 93.0887 90.5834 93.5027 89.9916 93.7474C89.3997 93.992 88.7487 94.0564 88.1204 93.9323C87.4921 93.8082 86.9144 93.5013 86.46 93.05L73.71 80.29L69.41 76L69.59 75.83L73.83 71.59L74 71.41L84.29 81.71L91.05 88.46C91.3517 88.7622 91.5908 89.1208 91.7539 89.5155C91.9169 89.9101 92.0005 90.333 92 90.76V90.76ZM48 74C42.5809 74.0127 37.3171 72.191 33.065 68.8314C28.813 65.4718 25.8231 60.7721 24.5819 55.4971C23.3407 50.2221 23.9213 44.6822 26.2291 39.7791C28.537 34.876 32.4362 30.8983 37.2924 28.4932C42.1485 26.0881 47.6757 25.3973 52.9744 26.5332C58.2731 27.669 63.0314 30.5647 66.4751 34.7489C69.9187 38.9332 71.8449 44.1597 71.9402 49.578C72.0355 54.9962 70.2943 60.2872 67 64.59L66.87 64.67L62.63 68.91L62.55 69.04C58.38 72.2532 53.2644 73.9971 48 74ZM67.73 66.9L71.73 70.9L68.9 73.73L64.9 69.73C65.9168 68.8632 66.8632 67.9168 67.73 66.9V66.9ZM85.41 80L74.71 69.29C74.617 69.1963 74.5064 69.1219 74.3846 69.0711C74.2627 69.0203 74.132 68.9942 74 68.9942C73.868 68.9942 73.7373 69.0203 73.6154 69.0711C73.4936 69.1219 73.383 69.1963 73.29 69.29L73.12 69.46L69 65.33C72.8605 60.0416 74.5836 53.4914 73.825 46.9879C73.0665 40.4844 69.8821 34.5066 64.9081 30.2486C59.9341 25.9907 53.5367 23.7662 46.994 24.0196C40.4514 24.273 34.2452 26.9855 29.6153 31.6153C24.9855 36.2452 22.273 42.4514 22.0196 48.994C21.7662 55.5367 23.9907 61.9341 28.2486 66.9081C32.5066 71.8821 38.4844 75.0665 44.9879 75.825C51.4914 76.5836 58.0416 74.8605 63.33 71L67.46 75.14L67.29 75.31C67.1963 75.403 67.1219 75.5136 67.0711 75.6354C67.0203 75.7573 66.9942 75.888 66.9942 76.02C66.9942 76.152 67.0203 76.2827 67.0711 76.4046C67.1219 76.5264 67.1963 76.637 67.29 76.73L70.59 80H2V14H94V80H85.41Z"
          fill="#39426A"
        />
        <path
          d="M9 4C8.40666 4 7.82664 4.17595 7.33329 4.50559C6.83994 4.83524 6.45543 5.30377 6.22836 5.85195C6.0013 6.40013 5.94189 7.00333 6.05765 7.58527C6.1734 8.16721 6.45912 8.70176 6.87868 9.12132C7.29824 9.54088 7.83279 9.8266 8.41473 9.94236C8.99667 10.0581 9.59987 9.9987 10.1481 9.77164C10.6962 9.54458 11.1648 9.16006 11.4944 8.66671C11.8241 8.17336 12 7.59334 12 7C12 6.20435 11.6839 5.44129 11.1213 4.87868C10.5587 4.31607 9.79565 4 9 4V4ZM9 8C8.80222 8 8.60888 7.94135 8.44443 7.83147C8.27998 7.72159 8.15181 7.56541 8.07612 7.38268C8.00043 7.19996 7.98063 6.99889 8.01922 6.80491C8.0578 6.61093 8.15304 6.43275 8.29289 6.29289C8.43275 6.15304 8.61093 6.0578 8.80491 6.01921C8.99889 5.98063 9.19996 6.00043 9.38268 6.07612C9.56541 6.15181 9.72159 6.27998 9.83147 6.44443C9.94135 6.60888 10 6.80222 10 7C10 7.26522 9.89464 7.51957 9.70711 7.70711C9.51957 7.89464 9.26522 8 9 8Z"
          fill="#39426A"
        />
        <path
          d="M19 4C18.4067 4 17.8266 4.17595 17.3333 4.50559C16.8399 4.83524 16.4554 5.30377 16.2284 5.85195C16.0013 6.40013 15.9419 7.00333 16.0576 7.58527C16.1734 8.16721 16.4591 8.70176 16.8787 9.12132C17.2982 9.54088 17.8328 9.8266 18.4147 9.94236C18.9967 10.0581 19.5999 9.9987 20.1481 9.77164C20.6962 9.54458 21.1648 9.16006 21.4944 8.66671C21.8241 8.17336 22 7.59334 22 7C22 6.20435 21.6839 5.44129 21.1213 4.87868C20.5587 4.31607 19.7957 4 19 4V4ZM19 8C18.8022 8 18.6089 7.94135 18.4444 7.83147C18.28 7.72159 18.1518 7.56541 18.0761 7.38268C18.0004 7.19996 17.9806 6.99889 18.0192 6.80491C18.0578 6.61093 18.153 6.43275 18.2929 6.29289C18.4327 6.15304 18.6109 6.0578 18.8049 6.01921C18.9989 5.98063 19.2 6.00043 19.3827 6.07612C19.5654 6.15181 19.7216 6.27998 19.8315 6.44443C19.9414 6.60888 20 6.80222 20 7C20 7.26522 19.8946 7.51957 19.7071 7.70711C19.5196 7.89464 19.2652 8 19 8Z"
          fill="#39426A"
        />
        <path
          d="M29 4C28.4067 4 27.8266 4.17595 27.3333 4.50559C26.8399 4.83524 26.4554 5.30377 26.2284 5.85195C26.0013 6.40013 25.9419 7.00333 26.0576 7.58527C26.1734 8.16721 26.4591 8.70176 26.8787 9.12132C27.2982 9.54088 27.8328 9.8266 28.4147 9.94236C28.9967 10.0581 29.5999 9.9987 30.1481 9.77164C30.6962 9.54458 31.1648 9.16006 31.4944 8.66671C31.8241 8.17336 32 7.59334 32 7C32 6.20435 31.6839 5.44129 31.1213 4.87868C30.5587 4.31607 29.7957 4 29 4V4ZM29 8C28.8022 8 28.6089 7.94135 28.4444 7.83147C28.28 7.72159 28.1518 7.56541 28.0761 7.38268C28.0004 7.19996 27.9806 6.99889 28.0192 6.80491C28.0578 6.61093 28.153 6.43275 28.2929 6.29289C28.4327 6.15304 28.6109 6.0578 28.8049 6.01921C28.9989 5.98063 29.2 6.00043 29.3827 6.07612C29.5654 6.15181 29.7216 6.27998 29.8315 6.44443C29.9414 6.60888 30 6.80222 30 7C30 7.26522 29.8946 7.51957 29.7071 7.70711C29.5196 7.89464 29.2652 8 29 8Z"
          fill="#39426A"
        />
        <path
          d="M89 4H47C45.8954 4 45 4.89543 45 6C45 7.10457 45.8954 8 47 8H89C90.1046 8 91 7.10457 91 6C91 4.89543 90.1046 4 89 4Z"
          fill="#C3E1F5"
        />
        <path
          d="M40 8C41.1046 8 42 7.10457 42 6C42 4.89543 41.1046 4 40 4C38.8954 4 38 4.89543 38 6C38 7.10457 38.8954 8 40 8Z"
          fill="#C3E1F5"
        />
        <g opacity="0.7" clipPath="url(#clip1_3703_21322)">
          <path
            d="M44.5764 35.9368L38.9147 57.0664L57.0259 61.9193L62.6875 40.7896L44.5764 35.9368Z"
            fill="#CCD1DC"
          />
          <path
            d="M62.6875 40.791L57.2688 61.016L43.6844 57.3754C43.2088 57.2478 42.7629 57.0277 42.3723 56.7278C41.9818 56.4278 41.6541 56.0539 41.408 55.6274C41.1619 55.2008 41.0023 54.7299 40.9382 54.2417C40.8741 53.7534 40.9068 53.2573 41.0344 52.7816L45.4813 36.1816L62.6875 40.791Z"
            fill="#DEE1E7"
          />
          <path
            d="M60.9335 41.2916L53.9909 39.4313C53.6575 39.342 53.3148 39.5398 53.2254 39.8732L48.5344 57.3806C48.445 57.7141 48.6429 58.0568 48.9763 58.1461L55.9189 60.0064C56.2523 60.0957 56.595 59.8978 56.6844 59.5644L61.3754 42.057C61.4648 41.7236 61.2669 41.3809 60.9335 41.2916Z"
            fill="#F3F4F5"
          />
          <path
            d="M45.8213 38.3119L41.939 52.8008L56.4279 56.6831L60.3101 42.1942L45.8213 38.3119Z"
            fill="#ABD9E6"
          />
          <path
            d="M57.1563 54.1918L56.5094 56.6074L52.0625 55.4168V52.8418C52.152 52.8558 52.2407 52.8746 52.3282 52.898C53.5344 53.2105 53.375 53.8355 54.5813 54.148C55.7875 54.4605 55.95 53.8668 57.1563 54.1918Z"
            fill="#7190C4"
          />
          <path
            d="M57.7219 52.0755L57.1563 54.188C55.95 53.8755 55.7875 54.4693 54.5813 54.1443C53.375 53.8193 53.5344 53.2068 52.3282 52.8943C52.2407 52.8708 52.152 52.852 52.0625 52.838V50.688C52.3429 50.6711 52.6242 50.7028 52.8938 50.7818C54.1 51.0943 53.9407 51.7193 55.1469 52.0318C56.3532 52.3443 56.5157 51.7505 57.7219 52.0755Z"
            fill="#89A3CE"
          />
          <path
            d="M60.3094 42.1855L58.1219 50.3355C50.6219 48.3262 45.5156 43.048 46.7219 38.5449L60.3094 42.1855Z"
            fill="#C3E1F5"
          />
          <path
            d="M52.0625 43.4375H33.3125V65.3125H52.0625V43.4375Z"
            fill="#CCD1DC"
          />
          <path
            d="M52.0625 43.4375V64.375H38C37.0054 64.375 36.0516 63.9799 35.3483 63.2767C34.6451 62.5734 34.25 61.6196 34.25 60.625V43.4375H52.0625Z"
            fill="#DEE1E7"
          />
          <path
            d="M50.5 44.375H43.3125C42.9674 44.375 42.6875 44.6548 42.6875 45V63.125C42.6875 63.4702 42.9674 63.75 43.3125 63.75H50.5C50.8452 63.75 51.125 63.4702 51.125 63.125V45C51.125 44.6548 50.8452 44.375 50.5 44.375Z"
            fill="#F3F4F5"
          />
          <path
            d="M50.1875 45.3125H35.1875V60.3125H50.1875V45.3125Z"
            fill="#ABD9E6"
          />
          <path
            d="M50.1875 58.1238V60.3113H45.1875L41.9563 57.0801L45.55 53.4863L50.1875 58.1238Z"
            fill="#85BD79"
          />
          <path
            d="M50.1875 58.1238V60.3113H45.1875L41.9563 57.0801L45.55 53.4863L50.1875 58.1238Z"
            fill="#85BD79"
          />
          <path
            d="M50.1875 58.1238V60.3113H46.4375L46.25 60.1238C45.4189 59.2934 44.882 58.2139 44.7213 57.0501C44.5605 55.8862 44.7846 54.7017 45.3594 53.677L45.55 53.4863L50.1875 58.1238Z"
            fill="#9FC98A"
          />
          <path
            d="M45.1875 60.3133H35.1875V59.7883L39.925 55.0508L45.1875 60.3133Z"
            fill="#85BD79"
          />
          <path
            d="M45.1875 60.3133L41.8781 60.1383C41.3026 60.1074 40.7484 59.9105 40.2824 59.5715C39.8164 59.2325 39.4585 58.7658 39.252 58.2278C39.0454 57.6898 38.9991 57.1035 39.1185 56.5397C39.2379 55.976 39.518 55.4588 39.925 55.0508V55.0508L45.1875 60.3133Z"
            fill="#9FC98A"
          />
          <path
            d="M50.1875 45.3125V53.75C42.4219 53.75 36.125 49.9719 36.125 45.3125H50.1875Z"
            fill="#C3E1F5"
          />
          <path
            d="M43.3125 50.3131C43.3125 50.7275 43.1479 51.1249 42.8549 51.418C42.5618 51.711 42.1644 51.8756 41.75 51.8756C41.3356 51.8756 40.9382 51.711 40.6452 51.418C40.3521 51.1249 40.1875 50.7275 40.1875 50.3131C40.188 50.1544 40.2112 49.9965 40.2563 49.8443C40.3544 49.5247 40.5524 49.245 40.8213 49.0462C41.0901 48.8475 41.4157 48.7402 41.75 48.7402C42.0844 48.7402 42.4099 48.8475 42.6788 49.0462C42.9476 49.245 43.1457 49.5247 43.2438 49.8443C43.2889 49.9965 43.312 50.1544 43.3125 50.3131Z"
            fill="#F6B756"
          />
          <path
            d="M41.75 50.9355C42.575 50.9355 43.2437 50.4459 43.2437 49.8418C43.2437 49.2377 42.575 48.748 41.75 48.748C40.925 48.748 40.2562 49.2377 40.2562 49.8418C40.2562 50.4459 40.925 50.9355 41.75 50.9355Z"
            fill="#FAC77D"
          />
          <path
            d="M41.75 50.9355C42.575 50.9355 43.2437 50.4459 43.2437 49.8418C43.2437 49.2377 42.575 48.748 41.75 48.748C40.925 48.748 40.2562 49.2377 40.2562 49.8418C40.2562 50.4459 40.925 50.9355 41.75 50.9355Z"
            fill="#FAC77D"
          />
          <path
            d="M55.8125 45.3131C55.8125 45.7275 55.6479 46.1249 55.3549 46.418C55.0618 46.711 54.6644 46.8756 54.25 46.8756C53.8356 46.8756 53.4382 46.711 53.1451 46.418C52.8521 46.1249 52.6875 45.7275 52.6875 45.3131C52.688 45.1544 52.7112 44.9965 52.7563 44.8443C52.8543 44.5247 53.0524 44.245 53.3212 44.0462C53.5901 43.8475 53.9156 43.7402 54.25 43.7402C54.5844 43.7402 54.9099 43.8475 55.1788 44.0462C55.4476 44.245 55.6457 44.5247 55.7437 44.8443C55.7888 44.9965 55.812 45.1544 55.8125 45.3131V45.3131Z"
            fill="#F6B756"
          />
          <path
            d="M54.25 45.9395C55.075 45.9395 55.7438 45.4498 55.7438 44.8457C55.7438 44.2416 55.075 43.752 54.25 43.752C53.425 43.752 52.7563 44.2416 52.7563 44.8457C52.7563 45.4498 53.425 45.9395 54.25 45.9395Z"
            fill="#FAC77D"
          />
          <path
            d="M35.1875 60.623H50.1875C50.2704 60.623 50.3499 60.5901 50.4085 60.5315C50.4671 60.4729 50.5 60.3934 50.5 60.3105V45.3105C50.5 45.2277 50.4671 45.1482 50.4085 45.0896C50.3499 45.031 50.2704 44.998 50.1875 44.998H35.1875C35.1046 44.998 35.0251 45.031 34.9665 45.0896C34.9079 45.1482 34.875 45.2277 34.875 45.3105V60.3105C34.875 60.3934 34.9079 60.4729 34.9665 60.5315C35.0251 60.5901 35.1046 60.623 35.1875 60.623ZM35.5 59.9137L39.925 55.4887L44.4344 59.998H35.5V59.9137ZM45.3156 59.998L42.3969 57.0793L45.55 53.9262L49.875 58.2512V59.998H45.3156ZM49.875 45.623V57.3699L45.7719 53.2637C45.7428 53.2344 45.7083 53.2111 45.6702 53.1953C45.6321 53.1794 45.5913 53.1712 45.55 53.1712C45.5087 53.1712 45.4679 53.1794 45.4298 53.1953C45.3917 53.2111 45.3572 53.2344 45.3281 53.2637L41.9562 56.6387L40.1469 54.8262C40.1178 54.7969 40.0833 54.7736 40.0452 54.7578C40.0071 54.7419 39.9663 54.7337 39.925 54.7337C39.8837 54.7337 39.8429 54.7419 39.8048 54.7578C39.7667 54.7736 39.7322 54.7969 39.7031 54.8262L35.5 59.0324V45.623H49.875Z"
            fill="#39426A"
          />
          <path
            d="M41.75 52.1895C42.1208 52.1895 42.4833 52.0795 42.7917 51.8735C43.1 51.6674 43.3403 51.3746 43.4823 51.032C43.6242 50.6894 43.6613 50.3124 43.589 49.9487C43.5166 49.5849 43.338 49.2509 43.0758 48.9886C42.8136 48.7264 42.4795 48.5478 42.1158 48.4755C41.7521 48.4031 41.3751 48.4403 41.0325 48.5822C40.6898 48.7241 40.397 48.9644 40.191 49.2728C39.985 49.5811 39.875 49.9436 39.875 50.3145C39.875 50.8117 40.0725 51.2886 40.4242 51.6403C40.7758 51.9919 41.2527 52.1895 41.75 52.1895V52.1895ZM41.75 49.0645C41.9972 49.0645 42.2389 49.1378 42.4444 49.2751C42.65 49.4125 42.8102 49.6077 42.9048 49.8361C42.9994 50.0645 43.0242 50.3158 42.976 50.5583C42.9277 50.8008 42.8087 51.0235 42.6339 51.1983C42.4591 51.3732 42.2363 51.4922 41.9938 51.5404C41.7514 51.5887 41.5 51.5639 41.2716 51.4693C41.0432 51.3747 40.848 51.2145 40.7106 51.0089C40.5733 50.8034 40.5 50.5617 40.5 50.3145C40.5 49.9829 40.6317 49.665 40.8661 49.4306C41.1005 49.1962 41.4185 49.0645 41.75 49.0645Z"
            fill="#39426A"
          />
          <path
            d="M41.75 52.1895C42.1208 52.1895 42.4833 52.0795 42.7917 51.8735C43.1 51.6674 43.3403 51.3746 43.4823 51.032C43.6242 50.6894 43.6613 50.3124 43.589 49.9487C43.5166 49.5849 43.338 49.2509 43.0758 48.9886C42.8136 48.7264 42.4795 48.5478 42.1158 48.4755C41.7521 48.4031 41.3751 48.4403 41.0325 48.5822C40.6898 48.7241 40.397 48.9644 40.191 49.2728C39.985 49.5811 39.875 49.9436 39.875 50.3145C39.875 50.8117 40.0725 51.2886 40.4242 51.6403C40.7758 51.9919 41.2527 52.1895 41.75 52.1895V52.1895ZM41.75 49.0645C41.9972 49.0645 42.2389 49.1378 42.4444 49.2751C42.65 49.4125 42.8102 49.6077 42.9048 49.8361C42.9994 50.0645 43.0242 50.3158 42.976 50.5583C42.9277 50.8008 42.8087 51.0235 42.6339 51.1983C42.4591 51.3732 42.2363 51.4922 41.9938 51.5404C41.7514 51.5887 41.5 51.5639 41.2716 51.4693C41.0432 51.3747 40.848 51.2145 40.7106 51.0089C40.5733 50.8034 40.5 50.5617 40.5 50.3145C40.5 49.9829 40.6317 49.665 40.8661 49.4306C41.1005 49.1962 41.4185 49.0645 41.75 49.0645Z"
            fill="#39426A"
          />
          <path
            d="M41.75 47.8145C41.8329 47.8145 41.9124 47.7815 41.971 47.7229C42.0296 47.6643 42.0625 47.5848 42.0625 47.502V46.877C42.0625 46.7941 42.0296 46.7146 41.971 46.656C41.9124 46.5974 41.8329 46.5645 41.75 46.5645C41.6671 46.5645 41.5876 46.5974 41.529 46.656C41.4704 46.7146 41.4375 46.7941 41.4375 46.877V47.502C41.4375 47.5848 41.4704 47.6643 41.529 47.7229C41.5876 47.7815 41.6671 47.8145 41.75 47.8145Z"
            fill="#39426A"
          />
          <path
            d="M41.75 52.8125C41.6671 52.8125 41.5876 52.8454 41.529 52.904C41.4704 52.9626 41.4375 53.0421 41.4375 53.125V53.75C41.4375 53.8329 41.4704 53.9124 41.529 53.971C41.5876 54.0296 41.6671 54.0625 41.75 54.0625C41.8329 54.0625 41.9124 54.0296 41.971 53.971C42.0296 53.9124 42.0625 53.8329 42.0625 53.75V53.125C42.0625 53.0421 42.0296 52.9626 41.971 52.904C41.9124 52.8454 41.8329 52.8125 41.75 52.8125Z"
            fill="#39426A"
          />
          <path
            d="M44.25 50.3125C44.25 50.3954 44.2829 50.4749 44.3415 50.5335C44.4001 50.5921 44.4796 50.625 44.5625 50.625H45.1875C45.2704 50.625 45.3499 50.5921 45.4085 50.5335C45.4671 50.4749 45.5 50.3954 45.5 50.3125C45.5 50.2296 45.4671 50.1501 45.4085 50.0915C45.3499 50.0329 45.2704 50 45.1875 50H44.5625C44.4796 50 44.4001 50.0329 44.3415 50.0915C44.2829 50.1501 44.25 50.2296 44.25 50.3125Z"
            fill="#39426A"
          />
          <path
            d="M38.3125 50.625H38.9375C39.0204 50.625 39.0999 50.5921 39.1585 50.5335C39.2171 50.4749 39.25 50.3954 39.25 50.3125C39.25 50.2296 39.2171 50.1501 39.1585 50.0915C39.0999 50.0329 39.0204 50 38.9375 50H38.3125C38.2296 50 38.1501 50.0329 38.0915 50.0915C38.0329 50.1501 38 50.2296 38 50.3125C38 50.3954 38.0329 50.4749 38.0915 50.5335C38.1501 50.5921 38.2296 50.625 38.3125 50.625Z"
            fill="#39426A"
          />
          <path
            d="M43.7375 48.6384C43.7789 48.6382 43.8198 48.6298 43.8578 48.6137C43.8959 48.5977 43.9304 48.5742 43.9594 48.5446L44.4031 48.104C44.4323 48.0749 44.4554 48.0403 44.4712 48.0022C44.4869 47.9641 44.495 47.9233 44.495 47.8821C44.495 47.8409 44.4869 47.8001 44.4712 47.7621C44.4554 47.724 44.4323 47.6894 44.4031 47.6603C44.374 47.6311 44.3394 47.608 44.3013 47.5922C44.2633 47.5765 44.2225 47.5684 44.1813 47.5684C44.1401 47.5684 44.0993 47.5765 44.0612 47.5922C44.0231 47.608 43.9885 47.6311 43.9594 47.6603L43.5188 48.104C43.4606 48.1626 43.4279 48.2418 43.4279 48.3243C43.4279 48.4069 43.4606 48.4861 43.5188 48.5446C43.5765 48.6035 43.6551 48.6372 43.7375 48.6384Z"
            fill="#39426A"
          />
          <path
            d="M39.5406 52.0799L39.0969 52.5206C39.0676 52.5496 39.0443 52.5842 39.0285 52.6223C39.0126 52.6603 39.0044 52.7012 39.0044 52.7424C39.0044 52.7837 39.0126 52.8245 39.0285 52.8626C39.0443 52.9007 39.0676 52.9353 39.0969 52.9643C39.1261 52.9933 39.1607 53.0162 39.1988 53.0317C39.2369 53.0473 39.2776 53.0552 39.3188 53.0549C39.3599 53.0552 39.4006 53.0473 39.4387 53.0317C39.4768 53.0162 39.5114 52.9933 39.5406 52.9643L39.9813 52.5206C40.014 52.4925 40.0405 52.4581 40.0593 52.4193C40.078 52.3805 40.0886 52.3383 40.0903 52.2953C40.0919 52.2522 40.0847 52.2093 40.069 52.1692C40.0532 52.1291 40.0294 52.0927 39.999 52.0622C39.9685 52.0318 39.9321 52.0079 39.892 51.9922C39.8519 51.9765 39.809 51.9693 39.7659 51.9709C39.7229 51.9726 39.6807 51.9831 39.6419 52.0019C39.6031 52.0207 39.5686 52.0472 39.5406 52.0799Z"
            fill="#39426A"
          />
          <path
            d="M43.9594 52.0799C43.9314 52.0472 43.8969 52.0207 43.8581 52.0019C43.8193 51.9831 43.7771 51.9726 43.7341 51.9709C43.691 51.9693 43.6481 51.9765 43.608 51.9922C43.5679 52.0079 43.5315 52.0318 43.501 52.0622C43.4706 52.0927 43.4468 52.1291 43.431 52.1692C43.4153 52.2093 43.4081 52.2522 43.4097 52.2953C43.4114 52.3383 43.422 52.3805 43.4407 52.4193C43.4595 52.4581 43.486 52.4925 43.5187 52.5206L43.9594 52.9643C43.9886 52.9933 44.0232 53.0162 44.0613 53.0317C44.0994 53.0473 44.1401 53.0552 44.1812 53.0549C44.2224 53.0552 44.2631 53.0473 44.3012 53.0317C44.3393 53.0162 44.3739 52.9933 44.4031 52.9643C44.4324 52.9353 44.4557 52.9007 44.4715 52.8626C44.4874 52.8245 44.4956 52.7837 44.4956 52.7424C44.4956 52.7012 44.4874 52.6603 44.4715 52.6223C44.4557 52.5842 44.4324 52.5496 44.4031 52.5206L43.9594 52.0799Z"
            fill="#39426A"
          />
          <path
            d="M39.5406 48.5446C39.5992 48.6028 39.6784 48.6355 39.7609 48.6355C39.8435 48.6355 39.9227 48.6028 39.9813 48.5446C40.0395 48.4861 40.0721 48.4069 40.0721 48.3243C40.0721 48.2418 40.0395 48.1626 39.9813 48.104L39.5406 47.6603C39.5115 47.6311 39.4769 47.608 39.4388 47.5922C39.4008 47.5765 39.36 47.5684 39.3188 47.5684C39.2775 47.5684 39.2367 47.5765 39.1987 47.5922C39.1606 47.608 39.126 47.6311 39.0969 47.6603C39.0677 47.6894 39.0446 47.724 39.0289 47.7621C39.0131 47.8001 39.005 47.8409 39.005 47.8821C39.005 47.9233 39.0131 47.9641 39.0289 48.0022C39.0446 48.0403 39.0677 48.0749 39.0969 48.104L39.5406 48.5446Z"
            fill="#39426A"
          />
          <path
            d="M62.9594 40.6262C62.9165 40.5551 62.8485 40.5027 62.7688 40.4794L44.6562 35.6262C44.6164 35.6154 44.5749 35.6125 44.534 35.6178C44.493 35.6231 44.4536 35.6365 44.4178 35.6571C44.3821 35.6777 44.3508 35.7052 44.3258 35.738C44.3007 35.7708 44.2824 35.8082 44.2719 35.8481L42.325 43.1262H33.3125C33.2296 43.1262 33.1501 43.1592 33.0915 43.2178C33.0329 43.2764 33 43.3559 33 43.4387V65.3137C33 65.3966 33.0329 65.4761 33.0915 65.5347C33.1501 65.5933 33.2296 65.6262 33.3125 65.6262H52.0625C52.1454 65.6262 52.2249 65.5933 52.2835 65.5347C52.3421 65.4761 52.375 65.3966 52.375 65.3137V60.9981L56.9438 62.2231C56.9707 62.2262 56.998 62.2262 57.025 62.2231C57.0955 62.2255 57.1648 62.204 57.2216 62.162C57.2783 62.12 57.3192 62.06 57.3375 61.9919L63 40.8731C63.0196 40.7887 63.005 40.6999 62.9594 40.6262ZM51.75 65.0012H33.625V43.7512H51.75V65.0012ZM52.375 53.2387C52.7029 53.3362 53.0022 53.5121 53.2469 53.7512C53.5947 54.0891 54.0261 54.3285 54.4969 54.445C54.7451 54.515 55.0015 54.5518 55.2594 54.5544C55.4847 54.5504 55.7089 54.5221 55.9281 54.47C56.2014 54.3988 56.4861 54.3829 56.7656 54.4231L56.2844 56.22L52.375 55.1762V53.2387ZM56.9313 53.8231C56.5576 53.7568 56.1741 53.7706 55.8063 53.8637C55.4292 53.9516 55.0363 53.9452 54.6623 53.8449C54.2884 53.7446 53.9449 53.5535 53.6625 53.2887C53.3148 52.9506 52.8834 52.7112 52.4125 52.595H52.3813V51.0106C52.5292 51.023 52.6757 51.0492 52.8187 51.0887C53.1979 51.1761 53.5446 51.369 53.8188 51.645C54.1687 51.98 54.5993 52.219 55.0688 52.3387C55.3163 52.4064 55.5715 52.4421 55.8281 52.445C56.0544 52.4423 56.2796 52.4151 56.5 52.3637C56.7733 52.2925 57.058 52.2766 57.3375 52.3169L56.9313 53.8231ZM57.4969 51.7106C57.1231 51.6458 56.74 51.6596 56.3719 51.7512C55.9948 51.8391 55.6019 51.8327 55.2279 51.7324C54.854 51.6321 54.5106 51.441 54.2281 51.1762C53.8803 50.8383 53.4489 50.5989 52.9781 50.4825C52.7808 50.4295 52.5788 50.396 52.375 50.3825V43.4387C52.375 43.3559 52.3421 43.2764 52.2835 43.2178C52.2249 43.1592 52.1454 43.1262 52.0625 43.1262H44.9156L46.125 38.6169L60.0094 42.3387L57.4969 51.7106ZM56.8031 61.5387L52.375 60.3512V55.8231L56.4375 56.9106H56.5188C56.5893 56.913 56.6586 56.8915 56.7153 56.8495C56.7721 56.8075 56.8129 56.7475 56.8313 56.6794L60.6938 42.1887C60.7046 42.1489 60.7075 42.1074 60.7022 42.0664C60.6969 42.0255 60.6835 41.9861 60.6629 41.9503C60.6423 41.9146 60.6148 41.8833 60.582 41.8582C60.5492 41.8332 60.5118 41.8149 60.4719 41.8044L45.9844 37.9325C45.9041 37.9126 45.8193 37.9238 45.7469 37.9637C45.711 37.9842 45.6796 38.0116 45.6544 38.0443C45.6291 38.0771 45.6107 38.1145 45.6 38.1544L44.2688 43.1262H42.9719L44.7969 36.32L62.2969 41.0075L56.8031 61.5387Z"
            fill="#39426A"
          />
          <path
            d="M56.125 45.8657C56.2207 45.5082 56.2085 45.1304 56.0899 44.7798C55.9712 44.4292 55.7514 44.1216 55.4583 43.8957C55.1651 43.6697 54.8116 43.5357 54.4424 43.5103C54.0731 43.4849 53.7046 43.5694 53.3833 43.753C53.062 43.9367 52.8022 44.2114 52.6367 44.5424C52.4712 44.8735 52.4074 45.2461 52.4533 45.6134C52.4992 45.9806 52.6527 46.3261 52.8946 46.6062C53.1365 46.8864 53.4559 47.0887 53.8125 47.1876C53.9708 47.2282 54.1335 47.2491 54.2969 47.2501C54.7119 47.2542 55.1165 47.1205 55.4473 46.87C55.7781 46.6195 56.0165 46.2663 56.125 45.8657V45.8657ZM55.5 45.7064C55.436 45.9451 55.3027 46.1595 55.1168 46.3225C54.9309 46.4855 54.7009 46.5897 54.4558 46.622C54.2108 46.6542 53.9616 46.6131 53.7399 46.5038C53.5182 46.3945 53.3339 46.2219 53.2102 46.0078C53.0866 45.7938 53.0292 45.5479 53.0453 45.3012C53.0614 45.0545 53.1503 44.8182 53.3008 44.622C53.4512 44.4258 53.6564 44.2787 53.8904 44.1991C54.1245 44.1196 54.3769 44.1112 54.6157 44.1751C54.7743 44.2175 54.923 44.2908 55.0533 44.3907C55.1836 44.4907 55.293 44.6153 55.3751 44.7575C55.4572 44.8997 55.5105 45.0567 55.532 45.2195C55.5534 45.3823 55.5426 45.5477 55.5 45.7064V45.7064Z"
            fill="#39426A"
          />
          <path
            d="M54.9437 42.9673C54.9706 42.9716 54.9981 42.9716 55.025 42.9673C55.0955 42.9697 55.1648 42.9481 55.2216 42.9061C55.2783 42.8641 55.3192 42.8042 55.3375 42.736L55.5 42.1423C55.5211 42.0627 55.5099 41.978 55.469 41.9067C55.428 41.8353 55.3605 41.7829 55.2812 41.761C55.2414 41.7501 55.1998 41.7473 55.1589 41.7526C55.118 41.7579 55.0785 41.7712 55.0428 41.7919C55.0071 41.8125 54.9758 41.84 54.9507 41.8728C54.9257 41.9056 54.9074 41.943 54.8968 41.9829L54.7375 42.586C54.7159 42.6639 54.7253 42.7471 54.7637 42.8182C54.8022 42.8893 54.8667 42.9427 54.9437 42.9673V42.9673Z"
            fill="#39426A"
          />
          <path
            d="M53.65 47.813C53.57 47.792 53.485 47.8036 53.4136 47.8451C53.3421 47.8867 53.29 47.9549 53.2688 48.0348L53.1063 48.638C53.0853 48.7179 53.0969 48.803 53.1384 48.8744C53.18 48.9459 53.2482 48.9979 53.3281 49.0192C53.3551 49.0224 53.3824 49.0224 53.4094 49.0192C53.4804 49.0215 53.55 48.9995 53.6068 48.9569C53.6636 48.9143 53.7042 48.8536 53.7219 48.7848L53.8844 48.1817C53.9012 48.1018 53.8862 48.0185 53.8424 47.9496C53.7986 47.8806 53.7295 47.8316 53.65 47.813V47.813Z"
            fill="#39426A"
          />
          <path
            d="M57.6875 45.9697L57.0812 45.8072C57.0008 45.786 56.9153 45.7977 56.8435 45.8396C56.7717 45.8815 56.7195 45.9502 56.6984 46.0306C56.6773 46.111 56.6889 46.1965 56.7308 46.2683C56.7727 46.3401 56.8415 46.3923 56.9218 46.4134L57.525 46.5728C57.5519 46.5773 57.5793 46.5773 57.6062 46.5728C57.6891 46.5836 57.7729 46.561 57.8391 46.51C57.9053 46.459 57.9486 46.3838 57.9593 46.3009C57.9701 46.218 57.9475 46.1343 57.8965 46.0681C57.8456 46.0018 57.7704 45.9586 57.6875 45.9478V45.9697Z"
            fill="#39426A"
          />
          <path
            d="M52.8906 43.2597C52.9456 43.2599 52.9996 43.2456 53.0473 43.2183C53.095 43.1909 53.1346 43.1515 53.1622 43.104C53.1897 43.0564 53.2043 43.0025 53.2043 42.9475C53.2044 42.8925 53.19 42.8385 53.1625 42.7909L52.85 42.2472C52.8293 42.2116 52.8018 42.1805 52.7691 42.1556C52.7364 42.1307 52.699 42.1125 52.6593 42.1021C52.6195 42.0916 52.578 42.0891 52.5373 42.0947C52.4966 42.1003 52.4573 42.1139 52.4219 42.1347C52.3509 42.1764 52.2993 42.2445 52.2782 42.3241C52.2572 42.4036 52.2683 42.4883 52.3094 42.5597L52.6219 43.1034C52.6491 43.1507 52.6883 43.1899 52.7354 43.2173C52.7826 43.2448 52.8361 43.2594 52.8906 43.2597Z"
            fill="#39426A"
          />
          <path
            d="M55.975 47.6612C55.9543 47.6257 55.9268 47.5946 55.8941 47.5697C55.8614 47.5448 55.8241 47.5266 55.7843 47.5161C55.7445 47.5057 55.7031 47.5032 55.6623 47.5088C55.6216 47.5144 55.5824 47.528 55.5469 47.5487C55.4759 47.5905 55.4243 47.6585 55.4033 47.7381C55.3822 47.8177 55.3934 47.9024 55.4344 47.9737L55.7469 48.5175C55.7901 48.5855 55.858 48.6342 55.9363 48.6534C56.0145 48.6725 56.0972 48.6607 56.167 48.6204C56.2368 48.5801 56.2883 48.5143 56.3107 48.4369C56.3332 48.3595 56.3249 48.2764 56.2875 48.205L55.975 47.6612Z"
            fill="#39426A"
          />
          <path
            d="M56.8906 44.2476L57.4312 43.9351C57.5033 43.8936 57.556 43.8252 57.5777 43.7449C57.5994 43.6647 57.5883 43.579 57.5469 43.5069C57.5263 43.4712 57.499 43.4399 57.4664 43.4148C57.4337 43.3897 57.3965 43.3712 57.3567 43.3605C57.2764 43.3388 57.1908 43.3499 57.1187 43.3913L56.5781 43.7038C56.506 43.7453 56.4533 43.8136 56.4316 43.8939C56.4099 43.9742 56.421 44.0598 56.4625 44.1319C56.5039 44.204 56.5723 44.2567 56.6526 44.2784C56.7329 44.3001 56.8185 44.289 56.8906 44.2476Z"
            fill="#39426A"
          />
        </g>
        <path
          d="M69 50C69 45.8466 67.7684 41.7865 65.4609 38.333C63.1533 34.8796 59.8736 32.188 56.0363 30.5985C52.1991 29.0091 47.9767 28.5932 43.9031 29.4035C39.8295 30.2138 36.0877 32.2139 33.1508 35.1508C30.2138 38.0877 28.2138 41.8295 27.4035 45.9031C26.5932 49.9767 27.0091 54.1991 28.5985 58.0364C30.188 61.8736 32.8796 65.1534 36.333 67.4609C39.7865 69.7684 43.8466 71 48 71C53.5695 71 58.911 68.7875 62.8492 64.8493C66.7875 60.911 69 55.5696 69 50ZM48 69C44.2421 69 40.5687 67.8857 37.4442 65.7979C34.3196 63.7102 31.8843 60.7428 30.4463 57.271C29.0082 53.7992 28.632 49.9789 29.3651 46.2933C30.0982 42.6077 31.9078 39.2222 34.565 36.565C37.2222 33.9078 40.6076 32.0982 44.2933 31.3651C47.9789 30.632 51.7992 31.0082 55.271 32.4463C58.7428 33.8844 61.7102 36.3196 63.7979 39.4442C65.8857 42.5687 67 46.2422 67 50C67 55.0391 64.9982 59.8718 61.435 63.435C57.8718 66.9982 53.0391 69 48 69Z"
          fill="#39426A"
        />
      </g>
      <defs>
        <clipPath id="clip0_3703_21322">
          <rect width="96" height="96" fill="white" />
        </clipPath>
        <clipPath id="clip1_3703_21322">
          <rect
            width="30"
            height="30"
            fill="white"
            transform="translate(33 35)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgImage);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;