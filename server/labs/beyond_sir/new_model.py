''' This is mainly demo code showing how to invoke the MODSIR19 simulator with
    default parameters
    python -m labs.beyond_sir.new_model [options] from the server directory to run the simulator
'''
import numpy as np
import matplotlib.pyplot as plt
from models.sir_h.state import State
from models.sir_h.simulator import run_sir_h
from models.rule import RuleChangeField, RuleEvacuation
from labs.defaults import get_default_params, import_json, export_json
import argparse
import csv
import os.path

import csv
import os.path

import pandas as pd
pd.options.mode.chained_assignment = None  # default='warn'

import matplotlib.dates as mdates
from scipy.integrate import odeint
import lmfit
from lmfit.lineshapes import gaussian, lorentzian

import warnings
warnings.filterwarnings('ignore')

def initial_code() :

    np.random.seed(42)
    x = np.linspace(0, 20.0, 1001)

    data = (gaussian(x, 21, 6.1, 1.2) + np.random.normal(scale=0.1, size=x.size))  # normal distr. with some noise
    plt.plot(x, data)

    def f(x, a, b, c):
        return gaussian(x, a, b, c)

    mod = lmfit.Model(f)
    # we set the parameters (and some initial parameter guesses)
    mod.set_param_hint("a", value=10.0, vary=True)
    mod.set_param_hint("b", value=10.0, vary=True)
    mod.set_param_hint("c", value=10.0, vary=True)

    params = mod.make_params()

    result = mod.fit(data, params, method="leastsq", x=x)  # fitting

    plt.figure(figsize=(8,4))
    result.plot_fit(datafmt="-")
    result.best_values

    result

    plt.gcf().subplots_adjust(bottom=0.15)

    def plotter(t, S, E, I, M, C, R, D, R_0, S_1=None, S_2=None, x_ticks=None):
        if S_1 is not None and S_2 is not None:
          print(f"percentage going to ICU: {S_1*100}; percentage dying in ICU: {S_2 * 100}")


        f, ax = plt.subplots(1,1,figsize=(20,4))
        if x_ticks is None:
            ax.plot(t, S, 'b', alpha=0.7, linewidth=2, label='Susceptible')
            ax.plot(t, E, 'y', alpha=0.7, linewidth=2, label='Exposed')
            ax.plot(t, I, 'r', alpha=0.7, linewidth=2, label='Infected')
            ax.plot(t, C, 'r--', alpha=0.7, linewidth=2, label='Critical')
            ax.plot(t, R, 'g', alpha=0.7, linewidth=2, label='Recovered')
            ax.plot(t, D, 'k', alpha=0.7, linewidth=2, label='Dead')
        else:
            ax.plot(x_ticks, S, 'b', alpha=0.7, linewidth=2, label='Susceptible')
            ax.plot(x_ticks, E, 'y', alpha=0.7, linewidth=2, label='Exposed')
            ax.plot(x_ticks, I, 'r', alpha=0.7, linewidth=2, label='Infected')
            ax.plot(x_ticks, C, 'r--', alpha=0.7, linewidth=2, label='Critical')
            ax.plot(x_ticks, R, 'g', alpha=0.7, linewidth=2, label='Recovered')
            ax.plot(x_ticks, D, 'k', alpha=0.7, linewidth=2, label='Dead')

            ax.xaxis.set_major_locator(mdates.YearLocator())
            ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            ax.xaxis.set_minor_locator(mdates.MonthLocator())
            f.autofmt_xdate()


        ax.title.set_text('extended SEIR-Model')

        ax.grid(b=True, which='major', c='w', lw=2, ls='-')
        legend = ax.legend()
        legend.get_frame().set_alpha(0.5)
        for spine in ('top', 'right', 'bottom', 'left'):
            ax.spines[spine].set_visible(False)

        plt.show();

        f = plt.figure(figsize=(20,4))
        # sp1
        ax1 = f.add_subplot(141)
        if x_ticks is None:
            ax1.plot(t, R_0, 'b--', alpha=0.7, linewidth=2, label='R_0')
        else:
            ax1.plot(x_ticks, R_0, 'b--', alpha=0.7, linewidth=2, label='R_0')
            ax1.xaxis.set_major_locator(mdates.YearLocator())
            ax1.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            ax1.xaxis.set_minor_locator(mdates.MonthLocator())
            f.autofmt_xdate()


        ax1.title.set_text('R_0 over time')
        ax1.grid(b=True, which='major', c='w', lw=2, ls='-')
        legend = ax1.legend()
        legend.get_frame().set_alpha(0.5)
        for spine in ('top', 'right', 'bottom', 'left'):
            ax.spines[spine].set_visible(False)

        # sp2
        ax2 = f.add_subplot(142)
        total_CFR = [0] + [100 * D[i] / sum(sigma*E[:i]) if sum(sigma*E[:i])>0 else 0 for i in range(1, len(t))]
        daily_CFR = [0] + [100 * ((D[i]-D[i-1]) / ((R[i]-R[i-1]) + (D[i]-D[i-1]))) if max((R[i]-R[i-1]), (D[i]-D[i-1]))>10 else 0 for i in range(1, len(t))]
        if x_ticks is None:
            ax2.plot(t, total_CFR, 'r--', alpha=0.7, linewidth=2, label='total')
            ax2.plot(t, daily_CFR, 'b--', alpha=0.7, linewidth=2, label='daily')
        else:
            ax2.plot(x_ticks, total_CFR, 'r--', alpha=0.7, linewidth=2, label='total')
            ax2.plot(x_ticks, daily_CFR, 'b--', alpha=0.7, linewidth=2, label='daily')
            ax2.xaxis.set_major_locator(mdates.YearLocator())
            ax2.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            ax2.xaxis.set_minor_locator(mdates.MonthLocator())
            f.autofmt_xdate()

        ax2.title.set_text('Fatality Rate (%)')
        ax2.grid(b=True, which='major', c='w', lw=2, ls='-')
        legend = ax2.legend()
        legend.get_frame().set_alpha(0.5)
        for spine in ('top', 'right', 'bottom', 'left'):
            ax.spines[spine].set_visible(False)

        # sp3
        ax3 = f.add_subplot(143)
        newDs = [0] + [D[i]-D[i-1] for i in range(1, len(t))]
        if x_ticks is None:
            ax3.plot(t, newDs, 'r--', alpha=0.7, linewidth=2, label='total')
        else:
            ax3.plot(x_ticks, newDs, 'r--', alpha=0.7, linewidth=2, label='total')
            ax3.xaxis.set_major_locator(mdates.YearLocator())
            ax3.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            ax3.xaxis.set_minor_locator(mdates.MonthLocator())
            f.autofmt_xdate()

        ax3.title.set_text('Deaths per day')
        ax3.yaxis.set_tick_params(length=0)
        ax3.xaxis.set_tick_params(length=0)
        ax3.grid(b=True, which='major', c='w', lw=2, ls='-')
        legend = ax3.legend()
        legend.get_frame().set_alpha(0.5)
        for spine in ('top', 'right', 'bottom', 'left'):
            ax.spines[spine].set_visible(False)

        # sp4
        ax4 = f.add_subplot(144)

        if x_ticks is None:

            ax4.plot(t, M, 'b', alpha=0.7, linewidth=2, label='Medical')
            ax4.plot(t, C, 'r--', alpha=0.7, linewidth=2, label='Critical')

            # ax42 = ax4.twinx()  # instantiate a second axes that shares the same x-axis
            # ax42.plot(t, R_0, 'g--', alpha=0.7, linewidth=2, label='R_0')

        else:
            ax4.plot(x_ticks, M, 'b', alpha=0.7, linewidth=2, label='Medical')
            ax4.plot(x_ticks, C, 'r--', alpha=0.7, linewidth=2, label='Critical')
            # ax42.plot(x_ticks, R_0, 'g--', alpha=0.7, linewidth=2, label='R_0')
            ax4.xaxis.set_major_locator(mdates.YearLocator())
            ax4.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
            ax4.xaxis.set_minor_locator(mdates.MonthLocator())
            f.autofmt_xdate()


        ax4.title.set_text('Hospital over time')
        ax4.grid(b=True, which='major', c='w', lw=2, ls='-')
        legend = ax4.legend()
        legend.get_frame().set_alpha(0.5)
        for spine in ('top', 'right', 'bottom', 'left'):
            ax.spines[spine].set_visible(False)

        # f.tight_layout()  # otherwise the right y-label is slightly clipped

        plt.show()

    def deriv(y, t, beta, gamma, sigma, dm_EI):
        S, E, I, M, C, R, D = y

        # dm_EI = 2.9 # incubation
        dm_IR = 9.0 # infectés rétablis
        dm_IC = 6.0 # infectés hospitalisés
        dm_IM = 6.0 # infectés hospitalisés

        dm_MC = 6.0
        dm_MR = 6.0
        dm_MD = 6.0

        dm_CD = 9.0
        dm_CR = 9.0

        pc_IR = 0.98
        pc_HC = 0 #0.16
        pc_IM = (1 - pc_IR) * (1 - pc_HC)
        pc_IC = (1 - pc_IR) * pc_HC

        pc_MC = 0 #0.21
        pc_MD = (1 - pc_MC) * 0.25
        pc_MR = (1 - pc_MC) * 0.75

        pc_CD = 0.40
        pc_CR = 1 - pc_CD

        N = S + E + I + R
        # print(f'pc_IM={pc_IM} pc_IC={pc_IC} pc_MD={pc_MD} pc_MR={pc_MR}')
        # print(f't={t} M={M} R0={beta(t)/gamma}')

        assert pc_IR + pc_IC + pc_IM == 1.0
        assert pc_MD + pc_MC + pc_MR == 1.0
        assert pc_CD + pc_CR == 1.0

        dSdt = -beta(t) * I * S / N

        dEdt =  beta(t) * I * S / N - 1/dm_EI * E

        dIdt = 1/dm_EI * E - gamma * pc_IR * I - 1/dm_IC * pc_IC * I - 1/dm_IM * pc_IM * I

        dMdt = 1/dm_IM * pc_IM * I - 1/dm_MD * pc_MD * M - 1/dm_MC * pc_MC * M - 1/dm_MR * pc_MR * M

        dCdt = 1/dm_IC * pc_IC * I + 1/dm_MC * pc_MC * M - 1/dm_CD * pc_CD * C - 1/dm_CR * pc_CR * C

        dRdt = gamma * pc_IR * I + 1/dm_CR * pc_CR * C + 1/dm_MR * pc_MR * M

        dDdt = 1/dm_CD * pc_CD * C + 1/dm_MD * pc_MD * M

        return dSdt, dEdt, dIdt, dMdt, dCdt, dRdt, dDdt

    gamma = 1.0/9.0 # dmg dm_IR
    sigma = 1.0/3.0 # incubation

    def Model(days, agegroups, R0_start = 3.31, R0_confinement = 0.6, R0_end = 1.2, dm_EI = 3.0):
        t_confinement = 70
        t_end = 126

        def R0(t, k, R0_start, t_confinement, R0_confinement, t_end, R0_end):

            # return 3.31
            # return R0_start if t < t_confinement else R0_confinement
            # if t<(t_confinement + t_end)/2:
            return (R0_start-R0_confinement) / (1 + np.exp(-k*(-t + t_confinement))) + R0_confinement
            # else:
              # return (R0_confinement-R0_end) / (1 + np.exp(-k*(-t + t_end))) + R0_end

        def beta(t):
            k = 1.0
            return R0(t, k, R0_start, t_confinement, R0_confinement, t_end, R0_end) * gamma

        N = sum(agegroups)

        y0 = N-1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0
        t = np.linspace(0, days, days)
        ret = odeint(deriv, y0, t, args=(beta, gamma, sigma, dm_EI))
        S, E, I, M, C, R, D = ret.T
        R0_over_time = [beta(i)/gamma for i in range(len(t))]

        return t, S, E, I, M, C, R, D, R0_over_time, dm_EI

    plotter(*Model(days=250, agegroups=[1000000]))

    # parameters
    # data = sortie SM (=SM+SI+SS) de notre modele
    data = [0.0, 0.0, 0.000907828877409664, 0.0021256029900954595, 0.0034380226243558255, 0.004784854005550408, 0.0061677373915483905, 0.007612517914239525, 0.009154481318035918, 0.010833009059725755, 0.01269009109212445, 0.014770415177499331, 0.017122108914645048, 0.01979777182058657, 0.02285566669005605, 0.026361035476037666, 0.030387545201390618, 0.03501888710185442, 0.04035056106047607, 0.046491883131462346, 0.053568258960140516, 0.06172377121736678, 0.07123279069650043, 0.08207977229685388, 0.0945473747793977, 0.10890093374785542, 0.12542979602683657, 0.14446390647060478, 0.16638318130244553, 0.1916255584219087, 0.22069565857140866, 0.2541747207740456, 0.2927321125872493, 0.33713864547509764, 0.38828194392139853, 0.44718416053767507, 0.5150223813027879, 0.5931521222862736, 0.6831343826825648, 0.7867667904623371, 0.9061194582589613, 1.0435762600862755, 1.2018785590916077, 1.3841936735562608, 1.5941601848272364, 1.8359673071507294, 2.114441385740001, 2.4351397112807547, 2.8044605889425083, 3.2297703367833686, 3.7195493535257516, 4.283560034930277, 4.933039775754524, 5.680922755566351, 6.542094721756046, 7.533685566209688, 8.675405149338465, 9.989928561110375, 11.503337827403438, 13.245627974141849, 15.25128635167987, 17.559955194369095, 20.217188533821272, 23.275315804337104, 26.794425649655942, 30.84348481566309, 35.50160775923699, 40.8594941580845, 47.02105164499879, 54.10522136451124, 62.24802343206972, 71.6048376212014, 82.35293134603579, 94.69424160134425, 106.1059537155242, 115.5060524146493, 122.58407483312777, 127.41972941949916, 130.26947090411628, 131.45042813243163, 131.280178170403, 130.04805901184073, 128.00387037197737, 125.35579802009127, 122.27291269062573, 118.8896486295215, 115.31085779995391, 111.61671864481153, 107.86716336733446, 104.10569932428916, 100.36261168022273, 96.65758907037308, 93.00183685963346, 89.399748278821, 85.52076715639335, 81.6069977239476, 77.7756995835696, 74.08012145599608, 70.54132934630992, 67.16462484791506, 63.94786802210212, 60.88560762600275, 57.97107771390773, 55.19713176130234, 52.55666185039855, 50.042776651410094, 47.648871179541814, 45.36865051951992, 43.19613512506757, 41.12565906399182, 39.15186538757014, 37.2696999019287, 35.47440364159165, 33.76150415399476, 32.1382874579788, 30.59518853885411, 29.1253292572007, 27.724535906565297, 26.389666408493092, 25.11792988652615, 23.906642647149436, 22.7531632189958, 21.65489233963389, 20.609290499810868, 19.613895477791097, 18.66633482790646, 17.764333029294946, 16.9057144328653, 16.088403300673274, 15.310421985742119, 14.569887994605077, 13.865010421666199, 13.194086064063145, 12.555495407100674, 11.94770563687629, 11.369241940099464, 10.818713835792302, 10.294771179457443, 9.796125191807507, 9.321554501002908, 8.869901310206517, 8.44006591552132, 8.031001977421834, 7.6417128792213775, 7.271248920516593, 6.918705031618533, 6.58321877717451, 6.263968510242691, 5.960171606114732, 5.671082746403956, 5.395992245584581, 5.13422442180949, 4.885136016942708, 4.648114670737313, 4.422577452872241, 4.2079694550807245, 4.00376244435754, 3.809453543499358, 3.6245640692626893, 3.4486383432882057, 3.2812426342890424, 3.121964141304484, 2.9704099969953335, 2.8262063028024587, 2.6889972067433514, 2.5584440279752094, 2.434224427459791, 2.3160316218465145, 2.203573637163068, 2.09657259917957, 1.9947640578363777, 1.8978963436277032, 1.805729954219469, 1.718036969843175, 1.6346004961736131, 1.5552141334984193, 1.4796814710481774, 1.4078156053856519, 1.3394386818432686, 1.2743814578806894, 1.2124828875638813, 1.1535897258843795, 1.0975561521205204, 1.0442434112332837, 0.9935194723894282, 0.9452587038316642, 0.8993415633735352, 0.855654303814165, 0.8140886925768174, 0.7745417448900057, 0.736915469853209, 0.7011166287585485, 0.6670565050715659, 0.6346506855059013, 0.6038188516567041, 0.5744845816854414, 0.5465751615743835, 0.5200214054926733, 0.49475748483784887, 0.4707207655372818, 0.4478516532135239, 0.42609344583573944, 0.4053921934975538, 0.38569656497783966, 0.36695772075782596, 0.34912919218335137, 0.33216676647607746, 0.31602837731183214, 0.3006740006977858, 0.286065555892913, 0.2721668111282915, 0.2589432938953499, 0.24636220558124233, 0.23439234024112796, 0.2230040073072649, 0.21216895804449104, 0.2018603155708702, 0.1920525082710394, 0.1827212064381213, 0.1738432619879868, 0.16539665109718688, 0.15736041962304004, 0.14971463117118575, 0.14244031768240634, 0.13551943241670641, 0.12893480521852477, 0.12267009995256244, 0.11670977400504864, 0.11103903975034893, 0.10564382788765803, 0.10051075255712541, 0.09562707814914417, 0.09098068772470644, 0.08656005296870067, 0.08235420560180616, 0.07835271018023976, 0.07454563821603549, 0.07092354355379782, 0.067477438942973, 0.06419877374763563, 0.06107941273859817, 0.05811161591532558, 0.05528801930768225, 0.05260161670996033, 0.050045742301943606, 0.04761405411395434, 0.04530051829491761, 0.04309939414446416, 0.04100521987198307, 0.03901279904733385]
    agegroups = [1000000]
    params_init_min_max = {"R0_start": (3.0, 2.0, 5.0),
                           "R0_confinement": (0.6, 0.3, 2.0),
                           "R0_end": (0.9, 0.3, 3.5),
                           "dm_EI": (3.0, 2.0, 6.0)
                           }  # form: {parameter: (initial guess, minimum value, max value)}

    days = len(data)
    y_data = np.array(data)

    x_data = np.linspace(0, days - 1, days, dtype=int)  # x_data is just [0, 1, ..., max_days] array
    print(list(x_data))
    print(len(x_data), len(y_data))
    def fitter(x, R0_start, R0_confinement, R0_end, dm_EI):
        ret = Model(days, agegroups, R0_start, R0_confinement, R0_end, dm_EI)
        return ret[4][x]

    mod = lmfit.Model(fitter)

    for kwarg, (init, mini, maxi) in params_init_min_max.items():
        mod.set_param_hint(str(kwarg), value=init, min=mini, max=maxi, vary=True)

    params = mod.make_params()
    fit_method = "leastsq"

    # NaN Error
    print(x_data)
    print(y_data)
    print(params)
    result = mod.fit(y_data, params, method="least_squares", x=x_data)

    result.plot_fit(datafmt="-")

    print(result.best_values)

    full_days = 250
    #first_date = np.datetime64(covid_data.Date.min()) - np.timedelta64(outbreak_shift,'D')
    first_date=np.datetime64('2020-01-06')
    x_ticks = pd.date_range(start=first_date, periods=full_days, freq="D")
    print("Prediction for France")
    #plotter(*Model(full_days, agegroup_lookup["France"], **result.best_values), x_ticks=x_ticks)
    plotter(*Model(full_days, [1000000], **result.best_values), x_ticks=x_ticks)



''' This is mainly demo code showing how to invoke the MODSIR19 simulator with
    default parameters or with provided file of stored parameters


                'SE': BoxSource('SE'),
                # 'INCUB': BoxQueue('INCUB', self.delay('dm_incub')),
                'INCUB': BoxConvolution('INCUB', compute_delay_ki(self.delay('dm_incub'))),

                'IR': BoxConvolution('IR', compute_exp_ki(self.delay('dm_r'))),
                'IH': BoxConvolution('IH', compute_exp_ki(self.delay('dm_h'))),
                'SM': BoxConvolution('SM', compute_exp_ki(self.delay('dm_sm'))),
                'SI': BoxConvolution('SI', [0, 0.03, 0.03, 0.04, 0.05, 0.05, 0.05, 0.05, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.05, 0.03, 0.02]),
                'SS': BoxConvolution('SS', compute_exp_ki(self.delay('dm_ss'))),

                'R': BoxTarget('R'),
                'DC': BoxTarget('DC')
'''
if __name__ == "__main__":

    parser = argparse.ArgumentParser(prog="python run_simulator.py", description='Run MODSIR-19 simulator on provided parameter sets.')
    parser.add_argument('-p', '--params', metavar='file', type=str, nargs='*',
                   help='pathname to parameter set (JSON)')
    parser.add_argument('-o', metavar='curve', type=str, nargs='+',
                   help="list of curve identifiers to output (in 'SE', 'INCUB', 'IR', 'IH', 'SM', 'SI', 'SS', 'R', 'DC')")
    parser.add_argument('--noplot', action='store_true', help="do not display obtained curves")
    parser.add_argument('-s', '--save', metavar='prefix', type=str, nargs=1,
                   help='filename prefix to output obtained curve points in .csv file format')

    args = parser.parse_args()

    initial_code()

    os.sys.exit()

    ''' default parameters are stored in three distinct groups '''
    default_params = get_default_params()
    parameters = default_params['parameters']
    rules = default_params['rules']
    data = default_params['data']
    other = default_params['other']

    ''' the simulator takes parameters and rules and produces series of points '''
    series = run_sir_h(parameters, rules)

    ''' default parameters also contain reference data '''
    day0 = data['day0']
    data_chu = data['data_chu_rea']
    data_day0 = {date-day0: data_chu[date]
                 for date in data_chu }

    if args.o :
        curve_list = args.o
    else :
        curve_list = ['SI']

    x = np.linspace(0, parameters['lim_time'], parameters['lim_time'])

    if not args.noplot :
        for curve in curve_list :
            c = series[curve]
            plt.plot(x, c, label="Baseline "+curve)
        ''' @TODO allow for other reference data to be plotted '''
        plt.plot(list(data_day0.keys()), list(data_day0.values()), 'x',  label="Data CHU SI")

    if args.params :
        for f in args.params :
            parameters, rules, other = defaults.import_json(f)
            f_base = os.path.splitext(os.path.basename(f))[0]
            series = run_sir_h(parameters, rules)

            for curve in curve_list :
                c = series[curve]
                if not args.noplot :
                    min_size = min(len(x),len(c))
                    plt.plot(x[:min_size], c[:min_size], label=curve + " " + f_base)
                if args.save :
                    with open(args.save[0]+curve+"_"+f_base+".csv", mode='w') as output_file:
                        output_writer = csv.writer(output_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

                        '''  @TODO check if numbering starts from 1 or from 0 '''
                        for item in zip(range(len(c)),c) :
                            output_writer.writerow(item)

    if not args.noplot :
        plt.legend(loc='upper right')
        plt.show()

    ''' examples for exporting/importing parameters
    export_json("mytest.json", parameters, rules, other)

    '''
