$(document).ready(function () {
    const rating = function () {
        const default$ = $('.rating-group .rating-state .state-default');
        const current$ = $('.rating-group .rating-state .state-current');
        const hover$ = $('.rating-group .rating-state .state-hover');
        const utils$ = $('.rating-group .rating-utils');
        const btnResetVote$ = $('.rating-group .btn-reset-vote');
        const review$ = $('.rating-group .rating-utils textarea');

        function activeRate(state, ele$=null) {
            const checkedVal = ele$ instanceof jQuery && ele$.length > 0 ? ele$.attr('value') : '';

            function hideAll() {
                default$.hide();
                current$.hide();
                hover$.hide();
                btnResetVote$.hide();
            }

            function reviewRequired(state){
                if (review$.length > 0) {
                    review$.attr('required', !!state);
                    // const frmTmp$ = review$.closest('form');
                    // if (frmTmp$.length > 0) {
                    //     const validator = frmTmp$.data('_validatorForm');
                    //     if (validator) validator.element(review$[0]);
                    // }
                }
            }

            switch (state) {
                case 'current':
                    hideAll();
                    if (checkedVal) {
                        current$.text(checkedVal).show();
                        utils$.slideDown();
                        btnResetVote$.show();
                        reviewRequired(!!ele$.data('review-require'));
                    } else {
                        default$.show();
                        utils$.slideUp();
                        btnResetVote$.hide();
                        reviewRequired(false);
                    }
                    break
                case 'hover':
                    hideAll();
                    hover$.text(checkedVal).show();
                    btnResetVote$.hide();
                    break
                case 'reset':
                    hideAll();
                    const eleTmp$ = $('.rating-group input[type=radio]:checked');
                    if (eleTmp$.length > 0) {
                        current$.text(eleTmp$.attr('value')).show();
                        utils$.slideDown();
                        btnResetVote$.show();
                        reviewRequired(!!eleTmp$.data('review-require'));
                    } else {
                        default$.show();
                        utils$.slideUp();
                        btnResetVote$.hide();
                        reviewRequired(false);
                    }
                    break
                default:
                    hideAll();
                    utils$.slideUp();
                    btnResetVote$.hide();
                    reviewRequired(false);
                    break
            }
        }

        btnResetVote$.on('click', function () {
            $(this).closest('.rating-group').find('input[type=radio]').prop('checked', false);
            activeRate('reset');
        })

        $('.rating-group input[type=radio][name]')
            .on('change', function () {
                activeRate('current', $(this));
            });

        let timeoutMouseOver = null;
        let timeoutMouseLeave = null;
        $('.rating-group label')
            .on('mouseover', function () {
                if (timeoutMouseOver) clearTimeout(timeoutMouseOver);
                timeoutMouseOver = setTimeout(
                    () => activeRate('hover', $(this).next('input')),
                    200
                )

            })
            .on('mouseleave', function () {
                if (timeoutMouseLeave) clearTimeout(timeoutMouseLeave);
                timeoutMouseLeave = setTimeout(
                    () => activeRate('reset'),
                    200
                )
            });

        const rated$ = $('.rating-group input[type=radio][name]:checked');
        if (rated$.length > 0) rated$.trigger('change');
        else activeRate('reset');
    }

    rating();
})