import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import useFetchData from '../hooks/useFetchData'
import Button from './button'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const VoteForm = props => {
  const [{ loading, error, data }, doFetch] = useFetchData('/submit-vote')
  return (
    <Formik
      initialValues={{
        likeability: 0,
        funniness: 0
      }}
      validateOnChange={false}
      validationSchema={object().shape({
        likeability: string().required('Please provide likeability'),
        funniness: string().required('Please provide funniness')
      })}
      onSubmit={(values, { setErrors, resetForm }) => {
        setErrors({
          funniness: false,
          likeability: false
        })
        let { likeability, funniness } = values
        let { comedian } = props
        doFetch({ likeability, funniness, comedian })
        resetForm()
      }}
    >
      {props => {
        const {
          values,
          errors,
          isSubmitting,
          handleChange,
          setFieldValue
        } = props

        return (
          <div>
            <Form>
              <div className='mt-6 mb-3 font-bold text-3xl'>
                Likeability {values.likeability}
              </div>
              <Slider
                type='range'
                value={values.likeability}
                max={10}
                min={0}
                onChange={value => setFieldValue('likeability', value)}
                marks
              />
              <div className='mt-6 mb-3 font-bold text-3xl'>
                Funniness {values.funniness}
              </div>
              <Slider
                type='range'
                value={values.funniness}
                max={10}
                min={0}
                onChange={value => setFieldValue('funniness', value)}
                marks
              />

              <div className='mt-2'>
                {
                  <div>
                    <div>
                      {errors.likeability ||
                        errors.funniness ||
                        errors.serverError}
                    </div>
                    <div>{error}</div>
                  </div>
                }
              </div>
              <div className='mt-2'>
                <div className='flex  justify-end'>
                  <Button disabled={isSubmitting} type='submit'>
                    VOTE
                  </Button>
                </div>
              </div>
            </Form>
            {data && <div className='font-bold text-4xl'>{data.success}</div>}
          </div>
        )
      }}
    </Formik>
  )
}

export default VoteForm

/*
<input
              onChange={handleChange}
              name='likeability'
              value={values.likeability}
              className='rounded-lg overflow-hidden appearance-none bg-gray-400 h-5 w-full'
              type='range'
              min='0'
              max='10'
              value='0'
            />*/
