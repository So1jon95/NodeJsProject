
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelector('.carousel');
   M.Carousel.init(elems, {});
});


const toCurrency = price =>{
    return new Intl.NumberFormat("en-EN", {
        currency: 'usd',
        style: 'currency'
    }).format(price)
}

const toDate = date => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.price').forEach(node =>{
    node.textContent= toCurrency(node.textContent) 
})

document.querySelectorAll('.date').forEach(node =>{
    node.textContent = toDate(node.textContent)
})

const $card = document.querySelector('#card')

if($card){
    $card.addEventListener('click', event =>{
        if(!event.target.classList.contains(' js-remove')){
            const id = event.target.dataset.id
            const csrf = event.target.dataset.csrf

            fetch('/card/remove/' + id,{
                method: 'delete',
            }).then(res => res.json())
            .then(card => {
                    if(card.courses.length){
                        const html = card.courses.map(c =>{ 
                            return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id="${c.id}">Удалить</button>
                                </td>
                            </tr>

                            `
                        }).join(' ')
                        $card.querySelector('tbody').innerHTML = html
                        $card.querySelector('.price').textContent = toCurrency(card.price)

                    }else{
                        $card.innerHTML = `<p>Корзина пуста</p>`
                    }
            })
            }
    })
}
M.Tabs.init(document.querySelectorAll('.tabs'));

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, {});
  });
  




